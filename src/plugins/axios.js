import axios from "axios";

axios.defaults.timeout = 15000; //请求超时的时间设定增加到15秒

export default ( app ) =>
{
    app.config.globalProperties.$axios = axios;
};
