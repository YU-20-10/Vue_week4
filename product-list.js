import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const apiUrl = "https://vue3-course-api.hexschool.io";
const apiPath = "yu_";
let productModal = null;
let delProductModal = null;

createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: [],
                is_enabled: 0
            },
            isNew: true,
            pagination: {}
        }
    },
    components: {
        "product-pagination": {
            props: {
                outerPagination:Object
            },
            template: "#product-pagination"
        },
        "product-modal": {
            props: {
                "outerTempProduct": Object,
                "outerIsNew": Boolean,
            },
            template: "#product-modal",
            methods: {
                initModal() {
                    productModal = new bootstrap.Modal("#productModal");
                },
                addNewProduct() {
                    axios.post(`${apiUrl}/v2/api/${apiPath}/admin/product`, { data: { ...this.outerTempProduct } })
                        .then((res) => {
                            productModal.hide();
                            alert("產品新增成功☆=(ゝω･)/");
                            this.$emit("update-data");
                        })
                        .catch((err) => {
                            alert(`怎麼辦好像哪裡出錯了＼(º □ º l|l)/${err.response?.data?.message}`)
                        })
                },
                editProduct() {
                    axios.put(`${apiUrl}/v2/api/${apiPath}/admin/product/${this.outerTempProduct.id}`, { data: { ...this.outerTempProduct } })
                        .then((res) => {
                            productModal.hide();
                            alert("產品編輯成功('-'*ゞ");
                            this.$emit("update-data")
                        })
                        .catch((err) => {
                            alert(`怎麼辦好像哪裡出錯了＼(º □ º l|l)/${err.response?.data?.message}`)
                        })
                },
                addOrEditProduct() {
                    this.outerIsNew ? this.addNewProduct() : this.editProduct();
                },
            },
            mounted() {
                this.initModal()
            }
        },
        "delete-modal": {
            props: {
                outerTempProduct: Object,
            },
            template: "#delete-modal",
            methods: {
                initModal() {
                    delProductModal = new bootstrap.Modal('#delProductModal');
                },
                deleteProduct() {
                    axios.delete(`${apiUrl}/v2/api/${apiPath}/admin/product/${this.outerTempProduct.id}`)
                        .then((res) => {
                            delProductModal.hide();
                            alert("產品刪除成功ヾ( ￣O￣)ツ");
                            this.$emit("update-data");
                        })
                        .catch((err) => {
                            alert(`怎麼辦好像哪裡出錯了＼(º □ º l|l)/${err.response?.data?.message}`)
                        })
                }
            },
            mounted() {
                this.initModal();
            }
        },

    },
    methods: {
        // ------ 登入確認 ------
        checkLogin() {
            axios.post(`${apiUrl}/v2/api/user/check`)
                .then((res) => {
                    this.getProductList();
                })
                .catch((err) => {
                    alert(`怎麼辦好像哪裡出錯了＼(º □ º l|l)/${err.response?.data?.message}`);
                })
        },
        // ------ 產品相關 ------
        getProductList(page = 1) {
            axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch((err) => {
                    alert(`怎麼辦好像哪裡出錯了＼(º □ º l|l)/${err.response?.data?.message}`)
                })
        },
        // ------ modal相關 ------
        openProductModal(mode, nowTarget) {
            if (mode === "add") {
                this.tempProduct = {
                    imagesUrl: [],
                    is_enabled: false
                };
                this.isNew = true;
            } else if (mode === "edit") {
                this.tempProduct = { ...nowTarget };
                this.isNew = false;
            }
            productModal.show();
        },
        openDeleteProductModel(nowTarget) {
            this.tempProduct = { ...nowTarget }
            delProductModal.show();
        }
    },
    mounted() {
        const userToken = document.cookie.replace(/(?:(?:^|.*;\s*)hextoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = userToken;
        this.checkLogin()
    }
}).mount("#app")

