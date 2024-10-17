import React, { useEffect, useState, useMemo, useCallback } from "react";
import ProLayout from "@ant-design/pro-layout";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Routes from "../../../common/helpers/Routes";
import PropTypes from "prop-types";
import Utils from "../../../common/helpers/Utils";
import {
    HomeOutlined,
    FileTextOutlined,
    ExperimentOutlined,
    ControlOutlined,
    TeamOutlined,
    MailOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import NavContent from "./NavContent";
import { useIsMobile } from "../../../common/hooks/IsMobile";
import axios from "axios";

const ZLayout = ({ children }) => {
    const isMobile = useIsMobile();
    const location = useLocation();
    const globalState = useSelector((state) => state.globalState);
    const history = useHistory();

    // Destructure values from globalState to prevent unnecessary re-renders
    const { logo, siteName, menuColor, navColor, menuLayout, shortMenu } =
        globalState;

    // Initialize collapsed state based on device type
    const [collapsed, setCollapsed] = useState(isMobile ? true : shortMenu);

    // Update collapsed state only when shortMenu changes and not on mobile
    useEffect(() => {
        if (!isMobile) {
            setCollapsed(shortMenu);
        }
    }, [shortMenu, isMobile]);

    const optimizeOnClick = useCallback(() => {
        const messageKey = "optimize";
        message.loading({
            content: "Action in progress...",
            duration: 0,
            key: messageKey,
        });

        axios
            .get(Routes.web.frontend.optimize, {
                headers: { Accept: "application/json" },
            })
            .then((response) => {
                Utils.handleSuccessResponse(response, () => {
                    message.success({
                        content: response.data.message,
                        key: messageKey,
                    });
                });
            })
            .catch(Utils.handleException);
    }, []);

    const routes = useMemo(
        () => [
            {
                path: Routes.web.admin.dashboard,
                key: Routes.web.admin.dashboard,
                name: "Dashboard",
                icon: <HomeOutlined />,
            },
            {
                path: "portfolio",
                name: "Portfolio",
                icon: <ExperimentOutlined />,
                routes: [
                    {
                        path: Routes.web.admin.portfolioConfig,
                        key: Routes.web.admin.portfolioConfig,
                        name: "Config",
                    },
                    {
                        path: Routes.web.admin.portfolioAbout,
                        key: Routes.web.admin.portfolioAbout,
                        name: "About",
                    },
                    {
                        path: Routes.web.admin.portfolioSkills,
                        key: Routes.web.admin.portfolioSkills,
                        name: "Skill",
                    },
                    {
                        path: Routes.web.admin.portfolioEducation,
                        key: Routes.web.admin.portfolioEducation,
                        name: "Education",
                    },
                    {
                        path: Routes.web.admin.portfolioExperiences,
                        key: Routes.web.admin.portfolioExperiences,
                        name: "Experience",
                    },
                    {
                        path: Routes.web.admin.portfolioProjects,
                        key: Routes.web.admin.portfolioProjects,
                        name: "Project",
                    },
                    {
                        path: Routes.web.admin.portfolioServices,
                        key: Routes.web.admin.portfolioServices,
                        name: "Service",
                    },
                ],
            },
            {
                path: Routes.web.admin.visitors,
                key: Routes.web.admin.visitors,
                name: "Visitor",
                icon: <TeamOutlined />,
            },
            {
                path: Routes.web.admin.messages,
                key: Routes.web.admin.messages,
                name: "Message",
                icon: <MailOutlined />,
            },
            {
                path: Routes.web.frontend.optimize,
                key: Routes.web.frontend.optimize,
                name: "Optimize",
                onclickHandle: optimizeOnClick,
                icon: <ThunderboltOutlined />,
            },
            {
                path: Routes.web.admin.systemLogs,
                key: Routes.web.admin.systemLogs,
                name: "System Logs",
                onclickHandle: () => window.open(Routes.web.admin.systemLogs),
                icon: <FileTextOutlined />,
            },
            {
                path: Routes.web.admin.settings,
                key: Routes.web.admin.settings,
                name: "Settings",
                icon: <ControlOutlined />,
            },
        ],
        [optimizeOnClick]
    );

    const layoutProps = useMemo(
        () => ({
            title: siteName,
            navTheme: menuColor,
            headerTheme: navColor,
            layout: isMobile ? "mix" : menuLayout,
            fixedHeader: true,
            collapsed,
            onCollapse: setCollapsed,
            logo: `${Utils.backend}/${logo}`,
            route: { routes },
        }),
        [
            collapsed,
            isMobile,
            logo,
            menuColor,
            navColor,
            siteName,
            menuLayout,
            routes,
        ]
    );

    const navigateToPath = useCallback(
        (path) => {
            history.push(path);
        },
        [history]
    );

    const handleMenuClick = useCallback(
        (e, item) => {
            e.preventDefault();
            if (item.onclickHandle) {
                item.onclickHandle();
            } else {
                navigateToPath(item.path);
            }
        },
        [navigateToPath]
    );

    return (
        <div style={{ height: "100vh" }}>
            <ProLayout
                {...layoutProps}
                location={location}
                fixSiderbar
                onMenuHeaderClick={() =>
                    navigateToPath(Routes.web.admin.dashboard)
                }
                menuItemRender={(item, dom) => (
                    <a
                        onClick={(e) => handleMenuClick(e, item)}
                        href={item.path}
                    >
                        {dom}
                    </a>
                )}
                rightContentRender={() => <NavContent />}
                breadcrumbRender={() => ""}
            >
                {children}
            </ProLayout>
        </div>
    );
};

ZLayout.propTypes = {
    children: PropTypes.node,
};

export default React.memo(ZLayout);
