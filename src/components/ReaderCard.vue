<script>
    export default {
        props: {
            reader: { type: Object, required: true },
        },
    };
</script>

<template>
    <div>
        <div class="p-1">
            <strong>Họ lót:</strong>
            {{ reader.HoLot }}
        </div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ reader.Ten }}
        </div>
        <div class="p-1">
            <strong>Ngày sinh:</strong>
            {{ reader.NgaySinh }}
        </div>
        <div class="p-1">
            <strong>Phái:</strong>
            {{ reader.Phai }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ reader.DiaChi }}
        </div>
        <div class="p-1">
            <strong>Điện thoại:</strong>
            {{ reader.DienThoai }}
        </div>
    </div>
</template>
