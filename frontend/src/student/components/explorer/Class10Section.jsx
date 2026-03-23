import React, { useState } from 'react';
import { SCard, SBtn } from '../../components/ui';
import { FiActivity, FiMonitor, FiTrendingUp, FiTool } from 'react-icons/fi';

const STREAMS = [
    { title: "Biology/Maths", icon: FiActivity, color: "green", desc: "Gateway to Medical, Engineering & Pure Sciences." },
    { title: "Computer Science", icon: FiMonitor, color: "blue", desc: "Leads to IT, Software, AI & Electronics." },
    { title: "Commerce", icon: FiTrendingUp, color: "orange", desc: "For CA, B.Com, Business Management & Finance." },
    { title: "Vocational", icon: FiTool, color: "purple", desc: "Polytechnic, ITI & Direct Skill-Based paths." }
];

export default function Class10Section() {
    const [quizStarted, setQuizStarted] = useState(false);

    return (
        <div id="class-10" style={{ scrollMarginTop: '100px', marginBottom: '60px' }}>
            <div className="s-anim-up" style={{ textAlign: 'center', marginBottom: 30 }}>
                <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 28, color: 'var(--s-text)', marginBottom: 8 }}>Class 10: The Crossroads</h2>
                <p style={{ fontSize: 15, color: 'var(--s-text3)' }}>Select your stream wisely for your future career.</p>
            </div>

            <div className="s-anim-up s-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
                {STREAMS.map((s, idx) => (
                    <SCard key={idx} hover style={{ textAlign: 'center', padding: '24px 16px' }}>
                        <s.icon size={32} color={`var(--s-${s.color})`} style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--s-text2)' }}>{s.desc}</p>
                    </SCard>
                ))}
            </div>

            <div className="s-anim-up s-d2" style={{ background: 'var(--s-surface2)', padding: '30px', borderRadius: 16, border: '1.5px solid var(--s-border)', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Unsure which path to choose?</h3>
                {!quizStarted ? (
                    <>
                        <p style={{ fontSize: 14, color: 'var(--s-text2)', marginBottom: 20 }}>Take our quick Path Finder Quiz to discover streams matching your interests!</p>
                        <SBtn variant="primary" onClick={() => setQuizStarted(true)}>Start Path Finder Quiz</SBtn>
                    </>
                ) : (
                    <div style={{ textAlign: 'left', background: 'var(--s-surface)', padding: 20, borderRadius: 12, border: '1px solid var(--s-border)' }}>
                        <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Q1: What subject do you enjoy studying the most?</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <SBtn variant="outline">A) Mathematics & Physics</SBtn>
                            <SBtn variant="outline">B) Biology & Nature</SBtn>
                            <SBtn variant="outline">C) Economics & Accounts</SBtn>
                            <SBtn variant="outline">D) Hands-on practical work</SBtn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
