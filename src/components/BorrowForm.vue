<template>    
    <Form @submit="submitBorrow" :validation-schema="borrowFormSchema">
        <!-- <div class="form-group">
            <label for="MaDocGia">Mã độc giả</label>
            <Field name="MaDocGia" type="text" class="form-control" v-model="borrowLocal.MaDocGia" />
            <ErrorMessage name="MaDocGia" class="error-feedback" />
        </div> -->

        <!-- Hiện tên độc giả -->
        <div class="form-group">
            <label for="MaDocGia">Tên độc giả</label>
            <Field as="select" name="MaDocGia" class="form-control" v-model="borrowLocal.MaDocGia">
                <option v-for="maDG in readers" :key="maDG._id" :value="maDG._id">
                    {{ maDG.HoLot }} {{ maDG.Ten }}
                </option>
            </Field>
            <ErrorMessage name="MaDocGia" class="error-feedback" />
        </div>

        <!-- Hiện tên sách được mượn -->
        <div class="form-group">
            <label for="MaSach">Tên sách mượn</label>
            <Field as="select" name="MaSach" class="form-control" v-model="borrowLocal.MaSach">
                <option v-for="masach in books" :key="masach._id" :value="masach._id">
                    {{ masach.TenSach }}
                </option>
            </Field>
            <ErrorMessage name="MaSach" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="NgayMuon">Ngày mượn</label>
            <Field name="NgayMuon" type="date" class="form-control" v-model="borrowLocal.NgayMuon" />
            <ErrorMessage name="NgayMuon" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="NgayTra">Ngày trả</label>
            <Field name="NgayTra" type="date" class="form-control" v-model="borrowLocal.NgayTra" />
            <ErrorMessage name="NgayTra" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="borrowLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBorrow">
                Xóa
            </button>
            <button type="button" class="ml-2 btn btn-secondary" @click="cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import BookService from "@/services/book.service";
import ReaderService from "@/services/reader.service";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:borrow", "delete:borrow"],
    props: {
        borrow: { type: Object, required: true }
    },
    data() {
        const borrowFormSchema = yup.object().shape({
            MaDocGia: yup.string().required("Mã độc giả phải có giá trị."),
            MaSach: yup.string().required("Mã sách phải có giá trị."),
            NgayMuon: yup.date().required("Ngày mượn phải có giá trị."),
            NgayTra: yup.date().required("Ngày trả phải có giá trị.")
                .min(yup.ref("NgayMuon"), "Ngày trả không thể trước ngày mượn."),
        });
        return {
            borrowLocal: this.borrow,
            borrowFormSchema,
            books: [],
            readers: [],
        };
    },
    methods: {
        submitBorrow() {
            this.$emit("submit:borrow", this.borrowLocal); // Đây là sự kiện gửi thông tin sách đã mượn
            BookService.borrowBook(this.borrowLocal.MaSach)  // Sử dụng MaSach thay vì _id nếu cần
                .then(response => {
                    console.log("Mượn sách thành công:", response);
                    this.$router.push({ name: "borrow" });  // Redirect hoặc làm gì đó sau khi mượn sách
                })
                .catch(error => {
                    console.error("Lỗi khi mượn sách:", error);
                });
        },


        // lấy dữ liệu book
        async loadBooks() {
            try {
                const response = await BookService.getAll();
                console.log("Danh sách sách từ API:", response); // Kiểm tra dữ liệu
                this.books = response;
            } catch (error) {
                console.error("Lỗi khi tải danh sách:", error);
            }
        },

        // lấy dữ liệu reader
        async loadReaders() {
            try {
                const response = await ReaderService.getAll();
                console.log("Danh sách từ API:", response); // Kiểm tra dữ liệu
                this.readers = response;
            } catch (error) {
                console.error("Lỗi khi tải danh sách:", error);
            }
        },

        deleteBorrow() {
            this.$emit("delete:borrow", this.borrowLocal.id);
        },
        cancel() {
            const reply = window.confirm("Bạn có chắc chắn muốn thoát mà không lưu thay đổi?");
            if (!reply) return;
            this.$router.push({ name: "borrow" });
        }
    },
    mounted() {
        this.loadBooks();
        this.loadReaders();
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
