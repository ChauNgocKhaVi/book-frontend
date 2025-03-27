<template>
    <div class="page">
        <h4>Thêm người mượn</h4>
        <BorrowForm :borrow="borrow" @submit:borrow="saveBorrow" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import BorrowForm from "@/components/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";

export default {
    components: {
        BorrowForm,
    },
    data() {
        return {
            borrow: { MaDocGia: "", MaSach: "", NgayMuon: "", NgayTra: "" },
            message: "",
        };
    },
    methods: {
        async saveBorrow(data) {
            try {
                await BorrowService.create(data);
                alert("Người mượn được thêm thành công.");
                this.$router.push({ name: "borowlist" });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
