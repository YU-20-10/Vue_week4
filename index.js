const { createApp } = Vue

createApp({
    data() {
        return {
            user: {
                username: null,
                password: null
            },
            url: "https://vue3-course-api.hexschool.io",
            apiPath: "yu_"
        }
    },
    methods: {
        postLogin() {
            const user = {
                username: this.user.username,
                password: this.user.password
            }
            axios.post(`${this.url}/v2/admin/signin`, user)
                .then((res) => {
                    console.log(res);
                    const { token, expired } = res.data;
                    document.cookie = `hextoken=${token};expired=${expired}`
                    location.href = "./product-list.html";
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
}).mount('#app')