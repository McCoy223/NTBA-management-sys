import React, { useState } from 'react';
import {
  Coins,
  Plus,
  Search,
  Check,
  X,
  Printer,
  Receipt,
  GraduationCap
} from 'lucide-react';
import { FeePayment, Student } from '../types';

interface FeesViewProps {
  feePayments: FeePayment[];
  students: Student[];
  onAddPayment: (payment: FeePayment) => void;
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
  onRecordActivity: (title: string, detail: string, tone: 'green' | 'blue' | 'purple' | 'yellow') => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  feePayments,
  students,
  onAddPayment,
  onNavigateDashboard,
  showToast,
  onRecordActivity
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Form state
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [klass, setKlass] = useState('P.3');
  const [amount, setAmount] = useState(250);
  const [category, setCategory] = useState('Tuition Fee');
  const [method, setMethod] = useState('Mobile Money (MTN)');

  const handleStudentSelect = (id: string) => {
    setStudentId(id);
    const found = students.find((s) => s.id === id);
    if (found) {
      setStudentName(`${found.firstName} ${found.lastName}`);
      setKlass(found.klass);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || amount <= 0) {
      showToast('Please enter student name and valid amount', 'warn');
      return;
    }

    const receiptNo = `REC-2026-${String(feePayments.length + 90).padStart(3, '0')}`;
    const newPayment: FeePayment = {
      id: `F-${Date.now()}`,
      receiptNo,
      studentId: studentId || 'NTBA/WALKIN',
      studentName: studentName.trim(),
      klass,
      amount: Number(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
      method,
      recordedBy: 'Finance Desk',
      status: 'Paid'
    };

    onAddPayment(newPayment);
    onRecordActivity('Fee Payment', `GHC ${amount}.00 - ${klass}`, 'blue');
    setIsModalOpen(false);
    setSelectedReceipt(newPayment);
    showToast(`Payment of GHC ${amount}.00 recorded for ${newPayment.studentName}`);
  };

  const totalCollected = feePayments.reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = feePayments.filter((p) =>
    `${p.receiptNo} ${p.studentName} ${p.studentId} ${p.category} ${p.klass}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="page-head" style={{ marginBottom: '22px' }}>
        <div className="titles">
          <p className="crumbs">
            <button type="button" onClick={onNavigateDashboard}>
              Dashboard
            </button>
            <span>›</span>
            <b>Bursary &amp; Accounts</b>
            <span>›</span>
            <span>Fee Payments</span>
          </p>
          <h1>
            <Coins />
            School Fees &amp; Payments Ledger
          </h1>
          <p>
            Track tuition payments, bus fares, uniform fees, and issue official school receipts.
          </p>
        </div>

        <div className="head-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus />
            Record Fee Payment
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="stats" style={{ marginBottom: '22px' }}>
        <article className="stat stat-blue">
          <span className="stat-icon"><Coins /></span>
          <strong>GHC {totalCollected.toLocaleString()}</strong>
          <p>Total Revenue (Term 1)</p>
          <small>↑ Verified payments recorded</small>
        </article>

        <article className="stat stat-green">
          <span className="stat-icon"><Receipt /></span>
          <strong>{feePayments.length}</strong>
          <p>Receipts Issued</p>
          <small>100% digital trace</small>
        </article>

        <article className="stat stat-yellow">
          <span className="stat-icon"><Coins /></span>
          <strong>84%</strong>
          <p>Fee Clearance Rate</p>
          <small>Target: 95% before mid-term</small>
        </article>

        <article className="stat stat-purple">
          <span className="stat-icon"><Coins /></span>
          <strong>GHC 650</strong>
          <p>Standard Primary Fee</p>
          <small>Per student per term</small>
        </article>
      </div>

      {/* Transactions Table */}
      <section className="card card-pad">
        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
          <label className="search" style={{ flex: 1, border: '1px solid #d8e4f0' }}>
            <Search />
            <input
              placeholder="Search by receipt number, student name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Category</th>
                <th>Payment Mode</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#0873ed' }}>
                    {p.receiptNo}
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <b>{p.studentName}</b>
                    <small style={{ display: 'block', color: '#7188a5' }}>{p.studentId}</small>
                  </td>
                  <td>
                    <span className="pill" style={{ background: '#e5f2ff', color: '#0873ed' }}>
                      {p.klass}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td style={{ fontSize: '12px', color: '#57779d' }}>{p.method}</td>
                  <td>
                    <b style={{ color: '#00804a', fontSize: '14px' }}>GHC {p.amount.toFixed(2)}</b>
                  </td>
                  <td>
                    <span className="pill" style={{ background: '#e5f7eb', color: '#00804a' }}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ height: '32px', fontSize: '11.5px', padding: '0 8px' }}
                      onClick={() => setSelectedReceipt(p)}
                    >
                      <Receipt style={{ width: '13px', height: '13px' }} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-head">
              <h3>
                <Coins />
                Record Student Fee Payment
              </h3>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="field">
                  <label>Select Enrolled Student (Optional Quick Fill)</label>
                  <select onChange={(e) => handleStudentSelect(e.target.value)}>
                    <option value="">Choose student from directory...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.klass} - {s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>Student Full Name <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Kwame Asante"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Class</label>
                    <select value={klass} onChange={(e) => setKlass(e.target.value)}>
                      <option value="Creche">Creche</option>
                      <option value="Nursery 1">Nursery 1</option>
                      <option value="Nursery 2">Nursery 2</option>
                      <option value="KG 1">KG 1</option>
                      <option value="KG 2">KG 2</option>
                      <option value="P.1">P.1</option>
                      <option value="P.2">P.2</option>
                      <option value="P.3">P.3</option>
                      <option value="P.4">P.4</option>
                      <option value="P.5">P.5</option>
                      <option value="P.6">P.6</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>Amount (GHC) <span className="req">*</span></label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className="field">
                    <label>Fee Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Term Books & Materials">Term Books &amp; Materials</option>
                      <option value="School Bus Transport">School Bus Transport</option>
                      <option value="School Uniform & Sportswear">School Uniform &amp; Sportswear</option>
                      <option value="Canteen / Feeding Package">Canteen / Feeding Package</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Payment Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="Mobile Money (MTN)">Mobile Money (MTN MoMo)</option>
                    <option value="Mobile Money (Telecel)">Mobile Money (Telecel Cash)</option>
                    <option value="Cash">Cash at School Counter</option>
                    <option value="Bank Transfer">Bank Transfer / Cheque</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check />
                  Issue Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>
                <Receipt />
                Official Payment Receipt
              </h3>
              <button type="button" className="icon-btn" onClick={() => setSelectedReceipt(null)}>
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  border: '2px dashed #073a78',
                  padding: '24px',
                  borderRadius: '12px',
                  background: '#fcfdff'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#073a78' }}>
                    <GraduationCap style={{ width: '28px', height: '28px' }} />
                    <b style={{ fontSize: '16px' }}>New Testament Baptist Academy</b>
                  </div>
                  <small style={{ display: 'block', color: '#6680a3', marginTop: '3px' }}>
                    P.O. Box 450, Adenta - Accra | Tel: +233 24 000 0000
                  </small>
                  <div className="pill saved" style={{ marginTop: '8px' }}>
                    OFFICIAL FEE RECEIPT: {selectedReceipt.receiptNo}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '16px' }}>
                  <div><span style={{ color: '#7188a5' }}>Date:</span> <b>{selectedReceipt.date}</b></div>
                  <div><span style={{ color: '#7188a5' }}>Class:</span> <b>{selectedReceipt.klass}</b></div>
                  <div><span style={{ color: '#7188a5' }}>Student:</span> <b>{selectedReceipt.studentName}</b></div>
                  <div><span style={{ color: '#7188a5' }}>Student ID:</span> <b>{selectedReceipt.studentId}</b></div>
                </div>

                <div style={{ background: '#f0f5fc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>{selectedReceipt.category}</span>
                    <b>GHC {selectedReceipt.amount.toFixed(2)}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#57779d' }}>
                    <span>Payment Channel: {selectedReceipt.method}</span>
                    <span style={{ color: '#00804a', fontWeight: 700 }}>PAID IN FULL</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#7188a5' }}>
                  <span>Recorded by: {selectedReceipt.recordedBy}</span>
                  <span style={{ fontStyle: 'italic' }}>Thank you for your prompt payment!</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                <Printer />
                Print Receipt
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setSelectedReceipt(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
