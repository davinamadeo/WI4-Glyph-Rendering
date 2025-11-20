# WI4 WebGL

**WI4 WebGL** adalah proyek WebGL sederhana yang menampilkan huruf **W**, **I**, dan angka **4** dalam bentuk **3D**, lengkap dengan animasi rotasi, warna dinamis, bouncing, dan outline.  
Seluruh geometri dibuat manual menggunakan koordinat vertex tanpa library tambahan, murni WebGL.

---

## Preview

> Render 3D berputar dengan efek warna dan outline.

<img width="2556" height="1364" alt="image" src="https://github.com/user-attachments/assets/f9248d45-bc8a-42b4-8c77-f09af27f37b9" />

---

## Fitur Utama

- **Solid 3D Mesh** untuk huruf W, I, dan angka 4  
- **Outline rendering** (pass kedua menggunakan `LINES`)  
- **Gradasi warna dinamis** berbasis uniform waktu  
- **Rotasi & bouncing animation**  
- **Klik Canvas** untuk pause/unpause  
- Kontrol keyboard:
  - **Space** : Freeze/Unfreeze
  - **↑** : Tambah kecepatan rotasi
  - **↓** : Kurangi kecepatan rotasi
  - **click** : Toggle Freeze 

---

## Kontrol Pengguna

| Aksi | Fungsi |
|------|--------|
| **Mouse Click** | Pause / Resume animasi |
| **Spacebar** | Pause / Resume animasi |
| **Arrow Up (↑)** | Meningkatkan kecepatan rotasi |
| **Arrow Down (↓)** | Menurunkan kecepatan rotasi |

