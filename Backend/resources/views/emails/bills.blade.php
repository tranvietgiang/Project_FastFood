<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Hóa đơn thanh toán</title>
</head>

<body>
    <h2>Hóa đơn thanh toán</h2>

    <p>Mã giao dịch: {{ $bill['apptransid'] ?? '' }}</p>
    <p>Số tiền: {{ isset($bill['bill_price_total']) ? number_format($bill['bill_price_total']) : '' }} VND</p>
    <p>Ngày thanh toán: {{ $bill['created_at'] ?? now() }}</p>

    <h3>Chi tiết sản phẩm</h3>
    <ul>
        <li>Product ID: {{ $bill['bill_product_id'] ?? '' }}</li>
        <li>User ID: {{ $bill['bill_user_id'] ?? '' }}</li>
        <li>Payment ID: {{ $bill['bill_payment_id'] ?? '' }}</li>
        <li>Số lượng: {{ $bill['bill_quantity'] ?? '' }}</li>
    </ul>
</body>

</html>
