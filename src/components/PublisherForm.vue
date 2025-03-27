<template>
    <Form @submit="submitPublisher" :validation-schema="publisherFormSchema">
        <div class="form-group">
            <label for="TenNXB">Tên nhà xuất bản</label>
            <Field name="TenNXB" type="text" class="form-control" v-model="publisherLocal.TenNXB" />
            <ErrorMessage name="TenNXB" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="DiaChi">Địa chỉ:</label>
            <Field name="DiaChi" type="text" class="form-control" v-model="publisherLocal.DiaChi" />
            <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="publisherLocal._id" type="button" class="ml-2 btn btn-danger" @click="deletePublisher">
                Xóa
            </button>
            <button type="button" class="ml-2 btn btn-danger" @click="Cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:publisher", "delete:publisher"],
    props: {
        publisher: { type: Object, required: true }
    },
    data() {
        const publisherFormSchema = yup.object().shape({
            TenNXB: yup
                .string()
                .required("Tên nhà xuất bản phải có giá trị.")
                .min(2, "Tên nhà xuất bản phải ít nhất 2 ký tự.")
                .max(100, "Tên nhà xuất bản có nhiều nhất 100 ký tự."),
            DiaChi: yup
                .string()
                .required("Địa chỉ phải có giá trị."),
        });
        return {
            publisherLocal: this.publisher,
            publisherFormSchema,
        };
    },
    methods: {
         async submitPublisher() {
            try {
                await this.$emit("submit:publisher", this.publisherLocal);
                this.$router.push({ name: "publisher" }); // Điều hướng sau khi lưu thành công
            } catch (error) {
                console.error("Lỗi khi lưu nhà xuất bản:", error);
            }
        },
        deletePublisher() {
            this.$emit("delete:publisher", this.publisherLocal.id);
        },
        Cancel() {
            const reply = window.confirm("Bạn có chắc chắn muốn thoát mà không lưu thay đổi?")

            if (!reply) {               
                    return false
                }
            else this.$router.push({ name: "publisher" });
            }
    },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>