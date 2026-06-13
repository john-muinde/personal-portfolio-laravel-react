import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Image, Row, Col, notification, Radio, Space } from 'antd';
import '../../common/assets/css/projects.css';
import ProjectPopup from '../components/ProjectPopup';
import Routes from '../../common/helpers/Routes';
import HTTP from '../../common/helpers/HTTP';
import Utils from '../../common/helpers/Utils';

const rootEl = document.getElementById('react-project-root');
const accentColor = rootEl ? rootEl.dataset.accentcolor : null;
const demoMode = rootEl ? rootEl.dataset.demomode : false;
const inlineProjects = (rootEl && rootEl.dataset.projects) ? JSON.parse(rootEl.dataset.projects) : null;

const thumbnailStyle = {
    height: '160px',
    width: '100%',
    transition: '0.3s ease',
    objectFit: 'cover'
}

function extractCategories(projects) {
    const cats = [];
    projects.forEach(row => {
        JSON.parse(row.categories).forEach(cat => cats.push(cat));
    });
    return [...new Set(cats)];
}

function App() {
    const [loading, setLoading] = useState(inlineProjects === null);
    const [modalVisible, setModalVisible] = useState(false);
    const [categories, setCategories] = useState(
        inlineProjects ? extractCategories(inlineProjects) : []
    );
    const [data, setData] = useState(inlineProjects || []);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (accentColor) {
            Utils.changeAccentColor(accentColor);
        }

        if (inlineProjects === null) {
            loadData();
        }

        if (demoMode) {
            notification.open({
                message: (
                    <div className="text-center">
                        <a target="_blank" rel="noreferrer" href="https://github.com/arifszn/ezfolio">
                            <img src="https://img.shields.io/github/stars/arifszn/ezfolio?style=social" alt="Github Star"/>
                        </a>
                    </div>
                ),
                description: <React.Fragment>
                    <Space direction="vertical" size="middle">
                        <div className="text-center">
                            Show your ❤️ and support by giving a ⭐️ on <a target="_blank" rel="noreferrer" href="https://github.com/arifszn/ezfolio">GitHub</a>.
                        </div>
                        <div className="text-center">
                            <a href={Routes.web.admin.dashboard} target="_blank" rel="noreferrer">Visit Admin Panel</a>
                        </div>
                    </Space>
                </React.Fragment>,
                placement: 'bottomRight',
                duration: 0,
                key: 'star-notification'
            });
        }
    }, [])

    const loadData = () => {
        setLoading(true);
        HTTP.get(Routes.api.frontend.projects, { isPrivate: false })
        .then(response => {
            Utils.handleSuccessResponse(response, () => {
                setData(response.data.payload);
                if (response.data.payload.length) {
                    setCategories(extractCategories(response.data.payload));
                }
            });
        })
        .catch(error => Utils.handleException(error))
        .finally(() => setLoading(false));
    }

    return (
        <React.Fragment>
            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={24} className="text-center" style={{marginBottom: '24px'}}>
                            {
                                (categories.length !== 0) && (
                                    <div data-aos="zoom-in">
                                        <Radio.Group onChange={(e) => {
                                            setSelectedCategory(typeof e.target.value === 'undefined' ? null : e.target.value);
                                        }}>
                                            <Radio.Button>All</Radio.Button>
                                            {
                                                categories.map((category, index) => (
                                                    <Radio.Button key={index} value={category} style={{textTransform: 'capitalize'}}>{category}</Radio.Button>
                                                ))
                                            }
                                        </Radio.Group>
                                    </div>
                                )
                            }
                        </Col>
                        <Col span={24} className="text-center">
                            <Row justify='center' gutter={[24, 24]}>
                                {
                                    data.filter(project =>
                                        selectedCategory === null ||
                                        JSON.parse(project.categories).includes(selectedCategory)
                                    ).map((item, index) => (
                                        <Col
                                            key={index}
                                            xl={6}
                                            lg={8}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            data-aos="fade-up"
                                            data-aos-delay={index % 4 * 60}
                                            data-aos-anchor-placement="top-bottom"
                                        >
                                            <Card
                                                onClick={() => {
                                                    setSelectedProject(item);
                                                    setModalVisible(true);
                                                }}
                                                loading={loading}
                                                bodyStyle={{padding: '16px'}}
                                                hoverable
                                                className={'z-shadow'}
                                                bordered={false}
                                                cover={
                                                    <Image
                                                        width='100%'
                                                        src={Utils.backend + '/' + item.thumbnail}
                                                        style={thumbnailStyle}
                                                        preview={false}
                                                        placeholder={true}
                                                    />
                                                }
                                                actions={[
                                                    <span key="view" style={{fontSize: '13px', fontWeight: 500}}>
                                                        View Details →
                                                    </span>
                                                ]}
                                            >
                                                <Card.Meta title={item.title} />
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                modalVisible && (
                    <ProjectPopup
                        title={selectedProject ? selectedProject.title : ''}
                        project={selectedProject}
                        visible={modalVisible}
                        handleCancel={() => setModalVisible(false)}
                    />
                )
            }
        </React.Fragment>
    );
}

if (document.getElementById('react-project-root')) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('react-project-root')
    );
}
