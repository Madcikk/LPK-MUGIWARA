import express from 'express';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import { verifyToken, requireRole } from '../middleware/auth.js';

import { db } from '../db.js';

dotenv.config();
const router = express.Router();

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// GET ALL PAYMENTS (untuk admin dashboard)
router.get('/', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        order_id,
        program_id,
        nama,
        email,
        telp,
        biaya,
        status,
        snap_token,
        created_at,
        updated_at
      FROM pembayaran 
      ORDER BY created_at DESC`
    );

    // Format data untuk frontend
    const result = rows.map(payment => {
      // Normalize status: bisa dari Midtrans callback atau database
      let status = payment.status || 'pending';
      // Jika status dari Midtrans, normalize ke format yang diharapkan frontend
      if (status === 'settlement' || status === 'capture') {
        status = 'success';
      } else if (status === 'deny' || status === 'cancel' || status === 'expire') {
        status = 'failed';
      }
      
      return {
        id: payment.id,
        order_id: payment.order_id,
        program_id: payment.program_id,
        nama: payment.nama,
        email: payment.email,
        telp: payment.telp,
        amount: payment.biaya || 0,
        status: status,
        date: payment.created_at,
        created_at: payment.created_at,
        updated_at: payment.updated_at
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: err.message });
  }
});

router.post('/process-transaction', async (req, res) => {
  try {
    const { nama, email, telp, biaya, program_id } = req.body;

    const orderId = `ORDER-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: biaya,
      },
      customer_details: {
        first_name: nama,
        email: email,
        phone: telp,
      },
      callbacks: {
        finish: 'http://localhost:5173/',
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    console.log('Token berhasil dibuat:', transactionToken);

    try {
      const sql = `
            INSERT INTO pembayaran 
            (order_id, program_id, nama, email, telp, biaya, status, snap_token) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
        `;

      const values = [orderId, program_id, nama, email, telp || null, biaya, transactionToken];

      await db.query(sql, values);

      console.log(`Data pembayaran berhasil disimpan untuk Order ID: ${orderId}`);
    } catch (dbError) {
      console.error('Gagal menyimpan ke database:', dbError);
    }

    res.status(200).json({
      token: transactionToken,
      orderId: orderId,
    });
  } catch (error) {
    console.error('Error Midtrans:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
