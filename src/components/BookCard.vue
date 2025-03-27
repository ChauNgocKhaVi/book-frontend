<script>
export default {
    props: {
        book: { type: Object, required: true },
    },
};
</script>

<template>
    <div>
        <!-- Hiển thị hình ảnh -->
        <div class="p-1">
            <strong>Hình ảnh:</strong>
            <img :src="'http://localhost:3000' + book.imageUrl" alt="Book Image" width="200" />
        </div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ book.TenSach }}
        </div>
        <div class="p-1">
            <strong>Đơn giá:</strong>
            {{ book.DonGia }}
        </div>
        <div class="p-1">
            <strong>Số quyển:</strong>
            {{ book.SoQuyen }}
        </div>
        <div class="p-1">
            <strong>Năm xuất bản:</strong>
            {{ book.NamXuatBan }}
        </div>
        <div class="p-1">
            <strong>Nhà xuất bản:</strong>
            {{ book.MaNXB }}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{ book.TacGia }}
        </div>

    </div>
</template>