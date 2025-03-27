<template>
    <Form @submit="submitBook" :validation-schema="bookFormSchema">
        <div class="form-group">
            <label for="TenSach">Tên sách</label>
            <Field name="TenSach" type="text" class="form-control" v-model="bookLocal.TenSach" />
            <ErrorMessage name="TenSach" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="DonGia">Đơn giá</label>
            <Field name="DonGia" type="number" class="form-control" v-model="bookLocal.DonGia" />
            <ErrorMessage name="DonGia" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="SoQuyen">Số quyển</label>
            <Field name="SoQuyen" type="number" class="form-control" v-model="bookLocal.SoQuyen" />
            <ErrorMessage name="SoQuyen" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="NamXuatBan">Năm xuất bản</label>
            <Field name="NamXuatBan" type="number" class="form-control" v-model="bookLocal.NamXuatBan" />
            <ErrorMessage name="NamXuatBan" class="error-feedback" />
        </div>
        <!-- <div class="form-group">
            <label for="MaNXB">Mã NXB</label>
            <Field name="MaNXB" type="number" class="form-control" v-model="bookLocal.MaNXB" />
            <ErrorMessage name="MaNXB" class="error-feedback" />
        </div> -->
        <div class="form-group">
            <label for="MaNXB">Nhà Xuất Bản</label>
            <Field as="select" name="MaNXB" class="form-control" v-model="bookLocal.MaNXB">
                <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                    {{ nxb.TenNXB }}
                </option>
            </Field>
            <ErrorMessage name="MaNXB" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="TacGia">Tác giả</label>
            <Field name="TacGia" type="text" class="form-control" v-model="bookLocal.TacGia" />
            <ErrorMessage name="TacGia" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="bookLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBook">
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
import PublisherService from "@/services/publisher.service";


export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true }
    },
    data() {
        const bookFormSchema = yup.object().shape({
            TenSach: yup
                .string()
                .required("Tên sách phải có giá trị.")
                .min(2, "Tên sách phải ít nhất 2 ký tự.")
                .max(100, "Tên sách có nhiều nhất 100 ký tự."),
            DonGia: yup
                .number()
                .required("Đơn giá phải có giá trị.")
                .positive("Đơn giá phải là số dương."),
            SoQuyen: yup
                .number()
                .required("Số quyển phải có giá trị.")
                .integer("Số quyển phải là số nguyên."),
            NamXuatBan: yup
                .number()
                .required("Năm xuất bản phải có giá trị.")
                .min(1900, "Năm xuất bản không hợp lệ.")
                .max(new Date().getFullYear(), "Năm xuất bản không thể lớn hơn năm hiện tại."),
            MaNXB: yup.string().required("Mã NXB phải có giá trị."),
            TacGia: yup.string().required("Tác giả phải có giá trị."),
        });
        return {
            bookLocal: this.book,
            bookFormSchema,
            publishers: [], // Danh sách NXB
        };
    },
    methods: {
        async submitBook() {
            try {
                await this.$emit("submit:book", this.bookLocal);
                this.$router.push({ name: "book" }); // Điều hướng sau khi lưu thành công
            } catch (error) {
                console.error("Lỗi khi lưu sách:", error);
            }
        },
        async loadPublishers() {
            try {
                const response = await PublisherService.getAll();
                console.log("Danh sách NXB từ API:", response); // Kiểm tra dữ liệu
                this.publishers = response;
            } catch (error) {
                console.error("Lỗi khi tải danh sách NXB:", error);
            }
        },


        deleteBook() {
            this.$emit("delete:book", this.bookLocal.id);
        },
        Cancel() {
            const reply = window.confirm("Bạn có chắc chắn muốn thoát mà không lưu thay đổi?")

            if (!reply) {               
                    return false
                }
                else this.$router.push({ name: "book" });
        }
    },
    mounted() {
        this.loadPublishers();
    },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>