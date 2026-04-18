import { useState, useMemo } from "react";

const SLM_BLUE      = "#00b4d8";
const SLM_BLUE_DARK = "#0096c7";
const SLM_BLUE_LIGHT= "#EBF7FD";
const SLM_NAVY      = "#112954";

const fmt       = (n) => `£${(Math.abs(parseFloat(n))||0).toFixed(0)}`;
const fmtDec    = (n) => `£${(Math.abs(parseFloat(n))||0).toFixed(2)}`;
const fmtSigned = (n) => { const v=parseFloat(n)||0; return (v>=0?"+ ":"− ")+`£${Math.abs(v).toFixed(0)}`; };
const pct       = (n) => `${(parseFloat(n)||0).toFixed(1)}%`;

// ─── OVERHEAD — datos reales corregidos por Sara (abril 2026) ─────────────
const DEFAULT_OVERHEAD = [
  { id:1,  name:"Teléfono (GiffGaff)",            amount:"10.00"  },
  { id:2,  name:"Web / Hosting",                  amount:"53.50"  },
  { id:3,  name:"OpenAI",                         amount:"17.93"  },
  { id:4,  name:"Canva",                          amount:"13.00"  },
  { id:5,  name:"Amazon Prime",                   amount:"8.99"   },
  { id:6,  name:"Spotify",                        amount:"12.99"  },
  { id:7,  name:"Gestor / Accountants",           amount:"150.00" },
  { id:8,  name:"Seguro negocio (Simply Business)",amount:"30.19" },
  { id:9,  name:"AA Membership",                  amount:"16.54"  },
  { id:10, name:"DVLA (coche)",                   amount:"29.31"  },
  { id:11, name:"Marketing (Happity)",            amount:"30.00"  },
  { id:12, name:"Parking casa (anual ÷ 12)",      amount:"29.75"  },
  { id:13, name:"Seguro del coche",               amount:"111.23" },
  { id:14, name:"Materiales (media ene–feb CSV)", amount:"97.00"  },
  // Cupcut eliminado — Sara dio de baja
];

const TICKET_TYPES = [
  { key:"trial",  label:"Trial",        emoji:"🎯", hint:"Sesión de prueba (pago único)" },
  { key:"single", label:"Sesión suelta",emoji:"🎫", hint:"Por sesión, sin compromiso" },
  { key:"term",   label:"Term Ticket",  emoji:"📦", hint:"Paquete completo de trimestre" },
];

const makeEnrollment = () => ({
  trial:  { count:"", price:"15" },
  single: { count:"", pricePerSession:"12", sessionsPerMonth:"4" },
  term:   { count:"", totalPrice:"192", termMonths:"3" },
});

const makePlaygroup = (id, name, rent, parking, teacherCost, myTravel, rentNote="") => ({
  id, name: name||`Playgroup ${id}`,
  rent: rent||"", parking: parking||"",
  teacherCost: teacherCost||"", myTravel: myTravel||"",
  enrollment: makeEnrollment(),
  rentNote,
});

// Kensington: £292.50 medio trimestre ÷ 1.5 = £195/mes
// Finchley: £194.40 mensual
const DEFAULT_PLAYGROUPS = [
  makePlaygroup(1,"Finchley Road (Sharesy)","194.40","","200","40","Mensual"),
  makePlaygroup(2,"Kensington (St. Mary's Abbots)","195.00","","100","60","£292.50 medio trimestre ÷ 1.5 = £195/mes"),
];

const DEFAULT_PRIVATE = {
  teacherCost:"310", myTravel:"120", parking:"50",
  enrollment: makeEnrollment(),
};

// ─── Revenue helpers ────────────────────────────────────────────────────────
const calcRev = (en) => {
  const trCount    = parseFloat(en.trial.count)||0;
  const trPrice    = parseFloat(en.trial.price)||0;
  const siCount    = parseFloat(en.single.count)||0;
  const siPPS      = parseFloat(en.single.pricePerSession)||0;
  const siSPM      = parseFloat(en.single.sessionsPerMonth)||0;
  const teCount    = parseFloat(en.term.count)||0;
  const teTotal    = parseFloat(en.term.totalPrice)||0;
  const teMths     = parseFloat(en.term.termMonths)||1;
  const trRev  = trCount * trPrice;
  const siRev  = siCount * siPPS * siSPM;
  const teRev  = teCount * (teTotal / teMths);
  return { trial:trRev, single:siRev, term:teRev, total:trRev+siRev+teRev };
};
const totalEnrolled = (en) =>
  (parseFloat(en.trial.count)||0) +
  (parseFloat(en.single.count)||0) +
  (parseFloat(en.term.count)||0);

// ─── Styles ─────────────────────────────────────────────────────────────────
const iStyle = (e={}) => ({
  border:"1px solid #E5E7EB", borderRadius:8, padding:"7px 10px",
  fontSize:13, fontFamily:"inherit", outline:"none", background:"white",
  boxSizing:"border-box", ...e,
});

function InfoBox({children}) {
  return (
    <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,
      padding:"10px 14px",marginBottom:14,fontSize:13,color:"#1e40af",lineHeight:1.5}}>
      ℹ️ {children}
    </div>
  );
}

function Field({label,emoji,value,onChange,placeholder,hint,noSymbol}) {
  return (
    <div>
      <label style={{fontSize:11,fontWeight:700,color:"#6b7280",display:"block",marginBottom:3}}>
        {emoji?`${emoji} `:""}{label}
      </label>
      <div style={{position:"relative"}}>
        {!noSymbol && <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:12,zIndex:1}}>£</span>}
        <input type="number" value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          style={iStyle({paddingLeft:noSymbol?8:20, width:"100%"})} />
      </div>
      {hint && <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{hint}</div>}
    </div>
  );
}

function PoundInput({value,onChange,width=90}) {
  return (
    <div style={{position:"relative",width}}>
      <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:12}}>£</span>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)}
        style={iStyle({paddingLeft:20,width:"100%",textAlign:"right"})} placeholder="0" />
    </div>
  );
}

function StatBadge({label,value,color="#374151",bg="#f3f4f6"}) {
  return (
    <div style={{background:bg,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
      <div style={{fontSize:10,color:"#6b7280",marginBottom:2}}>{label}</div>
      <div style={{fontWeight:800,fontSize:15,color}}>{value}</div>
    </div>
  );
}

function EnrollmentEditor({enrollment,onChange}) {
  const upd = (type,field,val) => onChange({
    ...enrollment,
    [type]:{...enrollment[type],[field]:val}
  });
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {TICKET_TYPES.map(t=>(
        <div key={t.key} style={{background:"#f9fafb",borderRadius:10,padding:"10px 12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:8}}>
            {t.emoji} {t.label} <span style={{fontWeight:400,color:"#9ca3af"}}>— {t.hint}</span>
          </div>
          <div style={{display:"grid",gap:8,
            gridTemplateColumns: t.key==="single" ? "repeat(3,1fr)" : t.key==="term" ? "repeat(3,1fr)" : "1fr 1fr"}}>
            <div>
              <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>Nº niños</div>
              <input type="number" value={enrollment[t.key].count}
                onChange={e=>upd(t.key,"count",e.target.value)}
                style={iStyle({width:"100%"})} placeholder="0" />
            </div>
            {t.key==="trial" && (
              <div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>Precio (£)</div>
                <PoundInput value={enrollment.trial.price} onChange={v=>upd("trial","price",v)} width="100%" />
              </div>
            )}
            {t.key==="single" && (<>
              <div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>£/sesión</div>
                <PoundInput value={enrollment.single.pricePerSession} onChange={v=>upd("single","pricePerSession",v)} width="100%" />
              </div>
              <div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>Sesiones/mes</div>
                <input type="number" value={enrollment.single.sessionsPerMonth}
                  onChange={e=>upd("single","sessionsPerMonth",e.target.value)}
                  style={iStyle({width:"100%"})} placeholder="4" />
              </div>
            </>)}
            {t.key==="term" && (<>
              <div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>Precio term (£)</div>
                <PoundInput value={enrollment.term.totalPrice} onChange={v=>upd("term","totalPrice",v)} width="100%" />
              </div>
              <div>
                <div style={{fontSize:10,color:"#6b7280",marginBottom:3}}>Meses/term</div>
                <input type="number" value={enrollment.term.termMonths}
                  onChange={e=>upd("term","termMonths",e.target.value)}
                  style={iStyle({width:"100%"})} placeholder="3" />
              </div>
            </>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultCard({title,children_,profit,revenue,totalCosts,directCosts,overheadAssigned,breakEven,margin,rev,costRows,accentColor=SLM_BLUE}) {
  const isProfit = profit >= 0;
  return (
    <div style={{background:"white",borderRadius:14,padding:18,marginBottom:16,
      boxShadow:"0 2px 12px rgba(0,0,0,0.06)",borderLeft:`4px solid ${accentColor}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:15,color:"#111827"}}>{title}</div>
        <div style={{
          background:isProfit?"#DCFCE7":"#FEE2E2",
          color:isProfit?"#15803d":"#dc2626",
          fontWeight:800,fontSize:16,padding:"4px 14px",borderRadius:999,
        }}>
          {fmtSigned(profit)}/mes
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        <StatBadge label="Ingresos"  value={fmt(revenue)}   bg="#f0fdf4" color="#15803d"/>
        <StatBadge label="Costes"    value={fmt(totalCosts)} bg="#fef2f2" color="#dc2626"/>
        <StatBadge label="Break-even" value={breakEven!=null?`${breakEven} niños`:"—"} bg="#eff6ff" color="#1d4ed8"/>
        <StatBadge label="Margen"    value={margin!=null?pct(margin):"—"} bg="#fefce8" color="#854d0e"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:13}}>
        <div style={{background:"#f9fafb",borderRadius:10,padding:"10px 12px"}}>
          <div style={{fontWeight:700,color:"#374151",marginBottom:8,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Costes directos</div>
          {costRows.map(([label,val])=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:4,color:parseFloat(val)>0?"#374151":"#9ca3af"}}>
              <span>{label}</span><span style={{fontWeight:600}}>{parseFloat(val)>0?fmt(val):"—"}</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid #e5e7eb",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontWeight:700}}>
            <span>Overhead asignado</span><span style={{color:"#6b7280"}}>{fmtDec(overheadAssigned)}</span>
          </div>
        </div>
        <div style={{background:"#f9fafb",borderRadius:10,padding:"10px 12px"}}>
          <div style={{fontWeight:700,color:"#374151",marginBottom:8,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Ingresos por ticket</div>
          {[
            ["🎯 Trial",    rev.trial ],
            ["🎫 Sueltas",  rev.single],
            ["📦 Term",     rev.term  ],
          ].map(([label,val])=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:4,color:val>0?"#374151":"#9ca3af"}}>
              <span>{label}</span><span style={{fontWeight:600}}>{val>0?fmt(val):"—"}</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid #e5e7eb",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontWeight:700}}>
            <span>Total niños</span><span>{children_}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function SLMCalculadora() {
  const [overhead,    setOverhead]    = useState(DEFAULT_OVERHEAD);
  const [newName,     setNewName]     = useState("");
  const [newAmount,   setNewAmount]   = useState("");
  const [playgroups,  setPlaygroups]  = useState(DEFAULT_PLAYGROUPS);
  const [nextId,      setNextId]      = useState(3);
  const [privateClasses,setPrivate]   = useState(DEFAULT_PRIVATE);
  const [tab,         setTab]         = useState("gastos");

  // ── Overhead ──
  const totalOverhead = useMemo(()=>overhead.reduce((s,i)=>s+(parseFloat(i.amount)||0),0),[overhead]);
  const overheadUnits = playgroups.length + 1; // playgroups + clases privadas
  const overheadPerUnit = overheadUnits>0 ? totalOverhead/overheadUnits : 0;

  // ── Resultados por playgroup ──
  const pgResults = useMemo(()=>
    playgroups.map(pg=>{
      const rent        = parseFloat(pg.rent)||0;
      const parking     = parseFloat(pg.parking)||0;
      const teacherCost = parseFloat(pg.teacherCost)||0;
      const myTravel    = parseFloat(pg.myTravel)||0;
      const directCosts = rent+parking+teacherCost+myTravel;
      const totalCosts  = directCosts+overheadPerUnit;
      const rev         = calcRev(pg.enrollment);
      const revenue     = rev.total;
      const profit      = revenue-totalCosts;
      const children    = totalEnrolled(pg.enrollment);
      const avgPerChild = children>0 ? revenue/children : 0;
      const breakEven   = avgPerChild>0 ? Math.ceil(totalCosts/avgPerChild) : null;
      const margin      = revenue>0 ? (profit/revenue)*100 : null;
      return {...pg,directCosts,totalCosts,revenue,profit,breakEven,margin,rev,children};
    }),[playgroups,overheadPerUnit]
  );

  // ── Clases privadas ──
  const privResult = useMemo(()=>{
    const teacherCost = parseFloat(privateClasses.teacherCost)||0;
    const myTravel    = parseFloat(privateClasses.myTravel)||0;
    const parking     = parseFloat(privateClasses.parking)||0;
    const directCosts = teacherCost+myTravel+parking;
    const totalCosts  = directCosts+overheadPerUnit;
    const rev         = calcRev(privateClasses.enrollment);
    const revenue     = rev.total;
    const profit      = revenue-totalCosts;
    const children    = totalEnrolled(privateClasses.enrollment);
    const avgPerChild = children>0 ? revenue/children : 0;
    const breakEven   = avgPerChild>0 ? Math.ceil(totalCosts/avgPerChild) : null;
    const margin      = revenue>0 ? (profit/revenue)*100 : null;
    return {directCosts,totalCosts,revenue,profit,breakEven,margin,rev,children};
  },[privateClasses,overheadPerUnit]);

  // ── Totales ──
  const totalRevenue  = pgResults.reduce((s,r)=>s+r.revenue,0)+privResult.revenue;
  const totalCostsAll = pgResults.reduce((s,r)=>s+r.totalCosts,0)+privResult.totalCosts;
  const totalProfit   = totalRevenue-totalCostsAll;
  const totalChildren = pgResults.reduce((s,r)=>s+r.children,0)+privResult.children;

  // ── Handlers overhead ──
  const updateOverhead = (id,field,val)=>setOverhead(p=>p.map(i=>i.id===id?{...i,[field]:val}:i));
  const removeOverhead = (id)=>setOverhead(p=>p.filter(i=>i.id!==id));
  const addOverhead    = ()=>{
    if(!newName.trim()||!newAmount) return;
    setOverhead(p=>[...p,{id:Date.now(),name:newName.trim(),amount:newAmount}]);
    setNewName(""); setNewAmount("");
  };

  // ── Handlers playgroups ──
  const addPlaygroup = ()=>{
    setPlaygroups(p=>[...p,makePlaygroup(nextId)]);
    setNextId(n=>n+1);
  };
  const removePlaygroup    = (id)=>setPlaygroups(p=>p.filter(g=>g.id!==id));
  const updatePlaygroup    = (id,field,val)=>setPlaygroups(p=>p.map(g=>g.id===id?{...g,[field]:val}:g));
  const updateEnrollmentPG = (id,en)=>setPlaygroups(p=>p.map(g=>g.id===id?{...g,enrollment:en}:g));
  const updateEnrollmentPR = (en)=>setPrivate(p=>({...p,enrollment:en}));

  // ── UI ──
  const TABS=[
    {key:"gastos",     label:"Overhead"},
    {key:"playgroups", label:"Playgroups"},
    {key:"privadas",   label:"Clases Privadas"},
    {key:"resultados", label:"Resultados"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Segoe UI',sans-serif"}}>
      {/* Header */}
      <div style={{background:SLM_NAVY,padding:"18px 24px"}}>
        <div style={{maxWidth:780,margin:"0 auto"}}>
          <div style={{fontSize:11,color:SLM_BLUE,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Shaping Little Minds</div>
          <h1 style={{margin:0,fontSize:20,fontWeight:800,color:"white"}}>Calculadora de Rentabilidad</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"white",borderBottom:"1px solid #e5e7eb"}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              padding:"13px 20px",border:"none",background:"transparent",
              fontSize:13,fontWeight:tab===t.key?700:400,
              color:tab===t.key?SLM_BLUE:"#6b7280",
              borderBottom:tab===t.key?`2px solid ${SLM_BLUE}`:"2px solid transparent",
              cursor:"pointer",fontFamily:"inherit",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:780,margin:"0 auto",padding:"24px 16px"}}>

        {/* ===== OVERHEAD ===== */}
        {tab==="gastos" && (
          <div style={{background:"white",borderRadius:14,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h2 style={{margin:"0 0 6px",fontSize:16,fontWeight:800,color:"#111827"}}>Gastos Generales (Overhead)</h2>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#6b7280"}}>Se reparten entre {overheadUnits} unidades ({playgroups.length} playgroup{playgroups.length!==1?"s":""} + clases privadas). Asignado a cada una: <strong>{fmtDec(overheadPerUnit)}/mes</strong></p>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f9fafb"}}>
                  <th style={{textAlign:"left",padding:"8px 10px",fontWeight:700,color:"#374151",borderRadius:"8px 0 0 8px"}}>Concepto</th>
                  <th style={{textAlign:"right",padding:"8px 10px",fontWeight:700,color:"#374151",width:120}}>Importe/mes</th>
                  <th style={{width:40}}></th>
                </tr>
              </thead>
              <tbody>
                {overhead.map(item=>(
                  <tr key={item.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"7px 10px"}}>
                      <input value={item.name} onChange={e=>updateOverhead(item.id,"name",e.target.value)}
                        style={iStyle({width:"100%",border:"none",background:"transparent",padding:"4px 0"})} />
                    </td>
                    <td style={{padding:"7px 10px",textAlign:"right"}}>
                      <PoundInput value={item.amount} onChange={v=>updateOverhead(item.id,"amount",v)} width={110} />
                    </td>
                    <td style={{padding:"7px 4px",textAlign:"center"}}>
                      <button onClick={()=>removeOverhead(item.id)}
                        style={{background:"transparent",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16,padding:"2px 6px",borderRadius:6}}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{background:"#eff6ff",fontWeight:800}}>
                  <td style={{padding:"10px",borderRadius:"0 0 0 8px"}}>TOTAL OVERHEAD</td>
                  <td style={{padding:"10px",textAlign:"right",fontSize:16,color:SLM_BLUE}}>{fmt(totalOverhead)}/mes</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="Nuevo concepto" style={iStyle({flex:1})} />
              <PoundInput value={newAmount} onChange={setNewAmount} width={110} />
              <button onClick={addOverhead} style={{
                background:SLM_BLUE,color:"white",border:"none",borderRadius:8,
                padding:"0 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              }}>+ Añadir</button>
            </div>
          </div>
        )}

        {/* ===== PLAYGROUPS ===== */}
        {tab==="playgroups" && (
          <div>
            <InfoBox>Overhead {fmt(totalOverhead)}/mes ÷ {overheadUnits} unidades = <strong>{fmtDec(overheadPerUnit)}</strong> asignado a cada playgroup.</InfoBox>
            {playgroups.map(pg=>(
              <div key={pg.id} style={{background:"white",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <input value={pg.name} onChange={e=>updatePlaygroup(pg.id,"name",e.target.value)}
                    style={iStyle({fontSize:15,fontWeight:700,border:"none",borderBottom:"2px solid #e5e7eb",borderRadius:0,padding:"4px 0"})} />
                  {playgroups.length>1 && (
                    <button onClick={()=>removePlaygroup(pg.id)}
                      style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:700}}>Eliminar</button>
                  )}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
                  <Field label="Renta" emoji="🏠" value={pg.rent} onChange={v=>updatePlaygroup(pg.id,"rent",v)}
                    hint={pg.rentNote||""} placeholder="0" />
                  <Field label="Parking" emoji="🚗" value={pg.parking} onChange={v=>updatePlaygroup(pg.id,"parking",v)} placeholder="0" />
                  <Field label="Profesora(s)" emoji="👩‍🏫" value={pg.teacherCost} onChange={v=>updatePlaygroup(pg.id,"teacherCost",v)} placeholder="0" />
                  <Field label="Mi transporte" emoji="⛽" value={pg.myTravel} onChange={v=>updatePlaygroup(pg.id,"myTravel",v)} placeholder="0" />
                </div>
                <div style={{borderTop:"1px solid #f3f4f6",paddingTop:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Niños matriculados</div>
                  <EnrollmentEditor enrollment={pg.enrollment} onChange={en=>updateEnrollmentPG(pg.id,en)} />
                </div>
              </div>
            ))}
            <button onClick={addPlaygroup} style={{
              width:"100%",padding:"13px",borderRadius:12,border:`2px dashed ${SLM_BLUE}`,
              background:SLM_BLUE_LIGHT,color:SLM_BLUE,fontSize:14,fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
            }}>+ Añadir playgroup</button>
          </div>
        )}

        {/* ===== CLASES PRIVADAS ===== */}
        {tab==="privadas" && (
          <div style={{background:"white",borderRadius:14,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h2 style={{margin:"0 0 6px",fontSize:16,fontWeight:800,color:"#111827"}}>🏡 Clases Privadas (domicilio)</h2>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#6b7280"}}>Overhead asignado: <strong>{fmtDec(overheadPerUnit)}/mes</strong></p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              <Field label="Profesora(s)" emoji="👩‍🏫" value={privateClasses.teacherCost}
                onChange={v=>setPrivate(p=>({...p,teacherCost:v}))} placeholder="0" />
              <Field label="Mi transporte" emoji="⛽" value={privateClasses.myTravel}
                onChange={v=>setPrivate(p=>({...p,myTravel:v}))} placeholder="0" />
              <Field label="Parking domicilios" emoji="🚗" value={privateClasses.parking}
                onChange={v=>setPrivate(p=>({...p,parking:v}))} placeholder="0" />
            </div>
            <div style={{borderTop:"1px solid #f3f4f6",paddingTop:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Niños / Ingresos</div>
              <EnrollmentEditor enrollment={privateClasses.enrollment} onChange={updateEnrollmentPR} />
            </div>
          </div>
        )}

        {/* ===== RESULTADOS ===== */}
        {tab==="resultados" && (
          <div>
            <InfoBox>
              Overhead {fmt(totalOverhead)}/mes ÷ {overheadUnits} unidades = <strong>{fmtDec(overheadPerUnit)} asignado a cada una</strong>.
            </InfoBox>

            {pgResults.map(r=>(
              <ResultCard key={r.id}
                title={r.name} children_={r.children}
                profit={r.profit} revenue={r.revenue}
                totalCosts={r.totalCosts} directCosts={r.directCosts}
                overheadAssigned={overheadPerUnit}
                breakEven={r.breakEven} margin={r.margin} rev={r.rev}
                costRows={[
                  ["🏠 Renta",          r.rent       ],
                  ["🚗 Parking",        r.parking    ],
                  ["👩‍🏫 Profesora(s)", r.teacherCost],
                  ["⛽ Mi transporte",  r.myTravel   ],
                ]}
              />
            ))}

            <ResultCard
              title="🏡 Clases Privadas"
              children_={privResult.children}
              profit={privResult.profit} revenue={privResult.revenue}
              totalCosts={privResult.totalCosts} directCosts={privResult.directCosts}
              overheadAssigned={overheadPerUnit}
              breakEven={privResult.breakEven} margin={privResult.margin} rev={privResult.rev}
              costRows={[
                ["👩‍🏫 Profesora(s)",   privateClasses.teacherCost],
                ["⛽ Mi transporte",    privateClasses.myTravel   ],
                ["🚗 Parking domicilios",privateClasses.parking   ],
              ]}
              accentColor="#4338ca"
            />

            {/* Resumen global */}
            <div style={{background:SLM_NAVY,color:"white",borderRadius:14,padding:20}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>📊 Resumen global del negocio / mes</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                {[
                  {label:"Ingresos",  value:fmt(totalRevenue)  },
                  {label:"Costes",    value:fmt(totalCostsAll) },
                  {label:"Beneficio", value:fmtSigned(totalProfit)},
                ].map(s=>(
                  <div key={s.label} style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:10,opacity:0.7,marginBottom:4}}>{s.label}</div>
                    <div style={{fontWeight:800,fontSize:18}}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {label:"Total niños",   value:totalChildren},
                  {label:"Margen global", value:totalRevenue>0?pct((totalProfit/totalRevenue)*100):"—"},
                ].map(s=>(
                  <div key={s.label} style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:10,opacity:0.7,marginBottom:4}}>{s.label}</div>
                    <div style={{fontWeight:800,fontSize:16}}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
