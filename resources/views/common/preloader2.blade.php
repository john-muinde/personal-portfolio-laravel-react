<div id="szn-preloader">
    <style>
        #szn-preloader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            overflow: hidden;
            background: #0d1117;
        }

        #szn-preloader:before {
            content: "";
            position: fixed;
            top: calc(50% - 20px);
            left: calc(50% - 20px);
            width: 40px;
            height: 40px;
            border: 2.5px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--z-accent-color, #0168fa);
            border-radius: 50%;
            -webkit-animation: animate-preloader 0.7s linear infinite;
            animation: animate-preloader 0.7s linear infinite;
        }

        @-webkit-keyframes animate-preloader {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes animate-preloader {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</div>
