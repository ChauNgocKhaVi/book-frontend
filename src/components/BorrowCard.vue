<script>
    export default {
        props: {
            borrow: { type: Object, required: true },
        },
    };
</script>

<template>
    <div>
        <div class="p-1">
            <strong>Mã Độc Giả:</strong>
            {{ borrow.MaDocGia }}
        </div>
        <div class="p-1">
            <strong>Mã Sách:</strong>
            {{ borrow.MaSach }}
        </div>
        <div class="p-1">
            <strong>Ngày Mượn:</strong>
            {{ borrow.NgayMuon }}
        </div>
        <div class="p-1">
            <strong>Ngày Trả:</strong>
            {{ borrow.NgayTra }}
        </div>
    </div>
</template>
