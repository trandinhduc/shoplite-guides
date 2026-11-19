## Story 7.1: Gợi ý tìm kiếm khi gõ

Spec: _bmad-output/implementation-artifacts/spec-7-1-goi-y-tim-kiem.md

### Thay đổi
- API mới `GET /api/products/suggest?q=` trả tối đa 5 gợi ý (tên, giá, còn hàng hay không).
- Ô tìm kiếm ở trang Sản phẩm thành combobox: gõ từ 2 ký tự, chờ 300 ms, chọn bằng chuột hoặc ↑ ↓ Enter, Esc để đóng.
- Tìm không dấu bằng `normalizeText`, khớp theo tên và thương hiệu, so như chữ thường (không dựng RegExp).
- Còn hàng xếp trước, hết hàng xếp sau và có nhãn "Hết hàng".

### Đã kiểm
- [x] `node scripts/ci/gate.mjs all` xanh 4 gate
- [x] Unit test cho từng dòng của I/O Matrix (`suggest-service.test.ts`), route (`route.test.ts`), giao diện (`search-suggestions.test.tsx`)
- [x] Test mới đỏ khi đặt lại code cũ (10 test)
- [x] Bỏ commit "refactor(cart)" (làm đỏ GH-4: giỏ đúng 500.000đ bị tính phí 30.000đ)
