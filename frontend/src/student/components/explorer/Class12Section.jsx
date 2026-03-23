import React from 'react';
import { SCard } from '../../components/ui';

const EXAMS = [
    { name: 'JEE Main/Advanced', date: 'Jan / April', desc: 'Engineering admissions at IITs, NITs, and CFTIs.', color: 'blue' },
    { name: 'NEET UG', date: 'May', desc: 'Medical entrance for MBBS, BDS across India.', color: 'green' },
    { name: 'TNEA', date: 'June', desc: 'Anna University Engineering Counseling based on board marks.', color: 'orange' },
    { name: 'ICAR AIEEA', date: 'June', desc: 'Agriculture and Allied Sciences admissions.', color: 'purple' }
];

export default function Class12Section() {
    return (
        <div id="class-12" style={{ scrollMarginTop: '100px', marginBottom: '60px' }}>
            <div className="s-anim-up" style={{ textAlign: 'center', marginBottom: 30 }}>
                <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 28, color: 'var(--s-text)', marginBottom: 8 }}>Class 12: The Launchpad</h2>
                <p style={{ fontSize: 15, color: 'var(--s-text3)' }}>Career entry, admissions, and roadmaps.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30 }}>
                {/* Exam Timeline */}
                <div className="s-anim-up s-d1" style={{ flex: '1 1 350px' }}>
                    <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Important Entrance Exams</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', paddingLeft: 16, borderLeft: '2px dashed var(--s-border)' }}>
                        {EXAMS.map((exam, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: -22, top: 4, width: 10, height: 10, borderRadius: '50%', background: `var(--s-${exam.color})` }} />
                                <div style={{ background: 'var(--s-surface2)', padding: '16px', borderRadius: 12, border: '1px solid var(--s-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <strong style={{ fontSize: 15, color: 'var(--s-text)' }}>{exam.name}</strong>
                                        <span style={{ fontSize: 12, padding: '2px 8px', background: 'var(--s-surface)', borderRadius: 10, fontWeight: 600, color: `var(--s-${exam.color})` }}>{exam.date}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--s-text3)' }}>{exam.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Comparison */}
                <div className="s-anim-up s-d2" style={{ flex: '1 1 350px' }}>
                    <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Degree Comparison</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <SCard style={{ borderTop: '4px solid var(--s-primary)' }}>
                            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Professional Courses (B.E, MBBS)</h4>
                            <ul style={{ fontSize: 13, color: 'var(--s-text2)', paddingLeft: 20, margin: 0 }}>
                                <li>Higher fee structure, mostly 4-5 years duration.</li>
                                <li>Direct and specialized campus placements.</li>
                                <li>Focus on technical/medical practice.</li>
                            </ul>
                        </SCard>
                        <SCard style={{ borderTop: '4px solid var(--s-purple)' }}>
                            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Arts & Sciences (B.Sc, B.Com, B.A)</h4>
                            <ul style={{ fontSize: 13, color: 'var(--s-text2)', paddingLeft: 20, margin: 0 }}>
                                <li>Lower fee structure, 3 years duration.</li>
                                <li>Provides broad foundation for Govt/Bank Exams.</li>
                                <li>Highly flexible career choices post-graduation.</li>
                            </ul>
                        </SCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
