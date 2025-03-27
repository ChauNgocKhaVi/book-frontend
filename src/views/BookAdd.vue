<template>
    <div class="page">
        <h4>Thêm Sách</h4>
        <BookForm :book="book" @submit:book="saveBook" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";

export default {
    components: {
        BookForm,
    },
    data() {
        return {
            book: { TenSach: "", DonGia: "", SoQuyen: "", NamXuatBan: "", MaNXB: "", TacGia: "" },
            message: "",
        };
    },
    methods: {
        async saveBook(data) {
            try {
                await BookService.create(data);
                alert("Sách được thêm thành công.");
                this.$router.push({ name: "booklist" });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
