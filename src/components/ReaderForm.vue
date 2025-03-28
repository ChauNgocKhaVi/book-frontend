<template>
    <Form @submit="submitReader" :validation-schema="readerFormSchema">
        <div class="form-group">
            <label for="HoLot">Họ lót</label>
            <Field name="HoLot" type="text" class="form-control" v-model="readerLocal.HoLot" />
            <ErrorMessage name="HoLot" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="Ten">Tên</label>
            <Field name="Ten" type="text" class="form-control" v-model="readerLocal.Ten" />
            <ErrorMessage name="Ten" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="NgaySinh">Ngày sinh</label>
            <Field name="NgaySinh" type="date" class="form-control" v-model="readerLocal.NgaySinh" />
            <ErrorMessage name="NgaySinh" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="Phai">Phái</label>
            <Field name="Phai" as="select" class="form-control" v-model="readerLocal.Phai">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </Field>
            <ErrorMessage name="Phai" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="DiaChi">Địa chỉ</label>
            <Field name="DiaChi" type="text" class="form-control" v-model="readerLocal.DiaChi" />
            <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="DienThoai">Điện thoại</label>
            <Field name="DienThoai" type="text" class="form-control" v-model="readerLocal.DienThoai" />
            <ErrorMessage name="DienThoai" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            
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
    emits: ["submit:reader", "delete:reader"],
    props: {
        reader: { type: Object, required: true }
    },
    data() {
        const readerFormSchema = yup.object().shape({
            HoLot: yup.string().required("Họ lót phải có giá trị."),
            Ten: yup.string().required("Tên phải có giá trị."),
            NgaySinh: yup.date().required("Ngày sinh phải có giá trị."),
            Phai: yup.string().oneOf(["Nam", "Nữ"], "Phái không hợp lệ.").required("Phái phải có giá trị."),
            DiaChi: yup.string().required("Địa chỉ phải có giá trị."),
            DienThoai: yup.string().matches(/^[0-9]+$/, "Điện thoại phải là số.").required("Điện thoại phải có giá trị."),
        });
        return {
            readerLocal: this.reader,
            readerFormSchema,
        };
    },
    methods: {
        async submitReader() {
            try {
                await this.$emit("submit:reader", this.readerLocal);
                this.$router.push({ name: "reader" }); // Điều hướng sau khi lưu thành công
            } catch (error) {
                console.error("Lỗi khi lưu nhà xuất bản:", error);
            }
        },
        deleteReader() {
            this.$emit("delete:reader", this.readerLocal.id);
        },
        Cancel() {
            const reply = window.confirm("Bạn có chắc chắn muốn thoát mà không lưu thay đổi?")
            if (!reply) {
                return false;
            }
            else this.$router.push({ name: "reader" });
        }
    },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
