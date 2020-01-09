import * as singleSpa from 'single-spa'; //导入single-spa
import axios from 'axios';

/*
* runScript：一个promise同步方法。可以代替创建一个script标签，然后加载服务
* */
const runScript = async (url) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
    });
};

/*
* getManifest：远程加载manifest.json 文件，解析需要加载的js
* */
const getManifest = (url, bundle) => new Promise(async (resolve) => {
    const { data } = await axios.get(url);
    const { entrypoints, publicPath } = data;
    const assets = entrypoints[bundle].assets;
    for (let i = 0; i < assets.length; i++) {
        await runScript(publicPath + assets[i]).then(() => {
            if (i === assets.length - 1) {
                resolve()
            }
        })
    }
});

singleSpa.registerApplication( //注册微前端服务
    'singleDemo',
    () => import('../sub-projects/sub-app-vuejs/src/main.js'),
    location => location.pathname.startsWith('/vue') // 配置微前端模块前缀
);

singleSpa.registerApplication( //注册微前端服务
    'test',
    () => import('../sub-projects/sub-app-test/src/main.js'),
    location => location.pathname.startsWith('/test') // 配置微前端模块前缀
);

singleSpa.registerApplication(
    'reactApp',
    () => import('../sub-projects/sub-app-react16/src/index.js'),
    location => location.pathname.startsWith('/react')
);

singleSpa.registerApplication(
    'angular-app',
    async () => {
        await runScript('http://localhost:3002/inline.bundle.js');
        await runScript('http://localhost:3002/polyfills.bundle.js');
        await runScript('http://localhost:3002/styles.bundle.js');
        await runScript('http://localhost:3002/vendor.bundle.js');
        await runScript('http://localhost:3002/main.bundle.js');
        return window.angularApp;
    },
    location => location.pathname.startsWith('/angular')
);

singleSpa.start(); // 启动
