import './main.scss';

const loadContent = () => {
    return 'Hello, World';
};

const root = document.querySelector('#app');
if (root != null) {
    // eslint-disable-next-line no-console
    console.log(`APP Version: ${__VERSION__}`);
    root.textContent = loadContent();
}
