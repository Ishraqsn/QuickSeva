import React, { useState, useEffect, useRef } from "react";
import { api, getDemoToken, saveDemoToken } from "./api.js";
import {
  ArrowLeft, Baby, BadgeCheck, Bell, BriefcaseBusiness, Building2, Calculator,
  CarFront, Check, ChevronRight, Clock3, CreditCard, Eye, FileBadge, FileText,
  Folder, GraduationCap, Headphones, House, IdCard, Info, Landmark, Lightbulb,
  LogOut, MessageCircle, Plus, Receipt, Search, Settings, Shield, Sparkles, Sprout, Star,
  TrendingUp, UserRound, UsersRound, Vote, Wallet,
} from "lucide-react";


const C = {
  primary:"#155EEF", primaryDark:"#103EAD", primaryLight:"#EAF0FF", primaryMid:"#DCE7FF",
  saffron:"#D97706", saffronDark:"#B45309", saffronLight:"#FFF4E5",
  success:"#138A53", successLight:"#E7F6ED", successDark:"#0D7042",
  danger:"#C93636", dangerLight:"#FDECEC",
  warning:"#A65C00", warningLight:"#FFF3D7",
  purple:"#7C3AED", purpleLight:"#EDE9FE",
  cyan:"#0891B2", cyanLight:"#ECFEFF",
  white:"#FFFFFF", bg:"#F4F7FB", bgAlt:"#EFF3F8", card:"#FFFFFF",
  border:"#E2E8F1", borderLight:"#EDF1F7",
  text:"#14233D", textSec:"#5C6B83", textMuted:"#77869E", textDisabled:"#CBD5E1",
  dark:"#15213A", dark2:"#24344F", dark3:"#43536C",
};

const css = `
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  html,body,#root{width:100%;height:100%;overflow:hidden;background:#F4F7FB;}
  body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;color:#14233D;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-thumb{background:#D5DCE8;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fade-up{animation:fadeUp .35s ease both;}
  .scale-in{animation:scaleIn .35s cubic-bezier(.34,1.56,.64,1) both;}
  #desktop-shell{height:100dvh!important;background:#F4F7FB!important;color:#14233D;}
  #shell-top{background:#fff!important;border-bottom:1px solid #E2E8F1!important;}
  #shell-top > div:first-child > div:last-child > div:first-child{color:#14233D!important;}
  #shell-top > div:first-child > div:last-child > div:last-child{color:#77869E!important;}
  #shell-top > div:last-child{background:#F0F3F8!important;border:1px solid #E2E8F1!important;}
  #shell-top > div:last-child span{color:#5C6B83!important;}
  #shell-tabs{background:#fff!important;border-bottom:1px solid #E2E8F1!important;}
  #shell-tabs button{border-color:#E2E8F1!important;color:#5C6B83!important;}
  #shell-bottom{background:#fff!important;border-top:1px solid #E2E8F1!important;}
  #shell-bottom button:first-child{background:#F4F7FB!important;border-color:#E2E8F1!important;color:#5C6B83!important;}
  #side-panel-card{background:#fff!important;border:1px solid #E2E8F1!important;box-shadow:0 8px 24px rgba(26,47,87,.07);}
  #side-panel-card button{border-color:#E2E8F1!important;color:#5C6B83!important;}
  #phone-bezel{background:#1B2740!important;border-radius:42px!important;padding:8px!important;box-shadow:0 25px 70px rgba(20,35,65,.22),0 0 0 1px #263450!important;}
  #desktop-shell #phone-screen{width:375px!important;height:680px!important;border-radius:30px!important;background:#F4F7FB!important;}
  #shell-top,#shell-tabs,#shell-bottom{color:#14233D!important;}
  #shell-tabs button{border-radius:9px!important;padding:7px 11px!important;}
  #shell-tabs button[style*="transparent"]{background:#fff!important;}
  #desktop-shell > div:nth-child(3) > div:first-child > div:first-child{color:#14233D!important;}
  #side-panel-card > div:first-child,#side-panel-card > div > div:first-child{color:#77869E!important;}
  #desktop-shell > div:nth-child(3){background:#F4F7FB!important;}
  button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #8BAEFF!important;outline-offset:2px;}
  @media(max-width:700px){
    #shell-top,#shell-tabs,#shell-bottom,#side-panel{display:none!important;}
    #phone-wrap{width:100vw!important;height:100dvh!important;padding:0!important;background:#F4F7FB!important;display:flex!important;align-items:stretch!important;justify-content:stretch!important;border-radius:0!important;box-shadow:none!important;}
    #phone-bezel{background:transparent!important;border-radius:0!important;padding:0!important;box-shadow:none!important;width:100%!important;}
    #phone-screen{width:100%!important;height:100dvh!important;border-radius:0!important;}
  #phone-screen>div{width:100%!important;height:100%!important;}
  }
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}}
`;

const SERVICES = [
  {id:"passport-fresh",name:"Passport Application",cat:"Identity",emoji:"🛂",dept:"Ministry of External Affairs",govtFee:1500,platFee:299,gst:54,days:"25–30 days",popular:true,tatkal:true,docs:["Aadhaar Card (Front & Back)","Birth Certificate","Address Proof","Passport-size Photo","Educational Certificate"],eligibility:"Indian citizen aged 18+. Valid Aadhaar required.",steps:["Fill online application","Upload documents","Book expert video call","Pay fees","Police verification","Government processing","Passport dispatched"],faqs:[{q:"How long does it take?",a:"Normal: 25–30 working days. Tatkal: 7 working days after police verification."},{q:"Is police verification mandatory?",a:"Yes, police verification is mandatory for fresh passports."},{q:"What if rejected?",a:"Full refund if rejected before government submission."}]},
  {id:"pan-card",name:"PAN Card",cat:"Identity",emoji:"🔖",dept:"NSDL / Income Tax Dept",govtFee:107,platFee:149,gst:27,days:"7–10 days",popular:true,tatkal:false,docs:["Aadhaar Card","Passport Photo","Signature"],eligibility:"Any Indian resident. No age restriction. One PAN per person.",steps:["Fill Form 49A","Upload Aadhaar","Aadhaar OTP verification","Pay fees","e-PAN issued instantly","Physical card dispatched"],faqs:[{q:"Can I get instant e-PAN?",a:"Yes, if Aadhaar is linked to your mobile, e-PAN issued instantly."},{q:"Total fee?",a:"₹283 total (Govt ₹107 + QuickSeva ₹149 + GST ₹27)."}]},
  {id:"income-certificate",name:"Income Certificate",cat:"Certificates",emoji:"💰",dept:"State Revenue Dept",govtFee:30,platFee:199,gst:36,days:"5–7 days",popular:true,tatkal:false,docs:["Aadhaar Card","Salary Slips (3 months) or ITR","Ration Card","Self-declaration"],eligibility:"Any resident with income. Valid for 1 year from issue.",steps:["Fill income details","Upload salary slips","Tehsildar review","Income verification","Certificate issued"],faqs:[{q:"Valid across India?",a:"Income certificates are state-specific."},{q:"Validity?",a:"Typically valid for 1 year from date of issue."}]},
  {id:"gst-registration",name:"GST Registration",cat:"Business",emoji:"🧾",dept:"GSTN / CBIC",govtFee:0,platFee:999,gst:180,days:"3–7 days",popular:true,tatkal:false,docs:["PAN Card","Aadhaar Card","Business Address Proof","Bank Statement","Cancelled Cheque"],eligibility:"Businesses with turnover > ₹40L (goods) or > ₹20L (services).",steps:["Fill REG-01 form","Upload documents","GSTN validation","ARN generated","GSTIN issued"],faqs:[{q:"Is it free?",a:"Government registration is free. QuickSeva charges ₹999 + GST."},{q:"How long?",a:"3 working days if documents are in order."}]},
  {id:"voter-id",name:"Voter ID (EPIC)",cat:"Identity",emoji:"🗳️",dept:"Election Commission of India",govtFee:0,platFee:149,gst:27,days:"15–30 days",popular:false,tatkal:false,docs:["Aadhaar Card","Age Proof","Residence Proof","Passport Photo"],eligibility:"Indian citizen aged 18+ residing in the constituency.",steps:["Fill Form 6","Upload proofs","BLO verification","Electoral roll update","EPIC card dispatched"],faqs:[{q:"Can I apply anytime?",a:"Yes, Voter ID applications are accepted year-round."}]},
  {id:"birth-certificate",name:"Birth Certificate",cat:"Certificates",emoji:"👶",dept:"Municipal Corporation",govtFee:50,platFee:149,gst:27,days:"5–7 days",popular:false,tatkal:false,docs:["Hospital Discharge Summary","Parents' Aadhaar","Marriage Certificate"],eligibility:"Any birth in India. Free within 21 days of birth.",steps:["Fill birth registration","Upload hospital proof","Municipality review","Registrar approval","Certificate issued"],faqs:[{q:"Home birth?",a:"A declaration from local health officer is required."}]},
  {id:"driving-licence",name:"Driving Licence",cat:"Identity",emoji:"🚗",dept:"Parivahan / State RTO",govtFee:400,platFee:249,gst:45,days:"21–30 days",popular:false,tatkal:false,docs:["Aadhaar Card","Learner's Licence","Passport Photo","Medical Certificate"],eligibility:"Age 18+ for LMV. Must have Learner's Licence for 30+ days.",steps:["Eligibility check","Fill Parivahan form","Book test slot","Pay fees","Attend driving test","DL dispatched"],faqs:[{q:"Do I need a test?",a:"Yes, you must appear for a driving test at the RTO."}]},
  {id:"itr-filing",name:"ITR Filing",cat:"Tax",emoji:"📊",dept:"Income Tax Department",govtFee:0,platFee:499,gst:90,days:"Instant",popular:true,tatkal:false,docs:["PAN Card","Aadhaar","Form 16","Bank Statements"],eligibility:"Individuals with taxable income above ₹2.5 lakh.",steps:["Collect Form 16","Expert computes income","ITR form selected","Review & verify","e-filing via IT portal","ITR-V acknowledgement"],faqs:[{q:"Multiple income sources?",a:"We handle ITR-2 and ITR-3 for all income types."}]},
];

const APPLICATIONS = [
  {id:"SVO-DEMO-001",serviceName:"Passport Application",emoji:"🛂",status:"verification",totalFee:1853,submittedAt:new Date().toISOString(),sla:null,tracking:[
    {label:"Submitted",desc:"Demo request saved; no payment collected.",date:"Sample update",done:true,active:false},
    {label:"Under Review",desc:"Demo checklist reviewed.",date:"Sample update",done:true,active:false},
    {label:"Verification",desc:"Illustrative demo status; no identity verification occurred.",date:"Active demo step",done:false,active:true},
    {label:"Processing",desc:"Sample status only; no government portal is connected.",date:"Expected demo update",done:false,active:false},
    {label:"Dispatched",desc:"Illustrative dispatch status.",date:"Expected demo update",done:false,active:false},
    {label:"Completed",desc:"Illustrative completion status.",date:"Expected demo update",done:false,active:false},
  ]},
  {id:"SVO-DEMO-002",serviceName:"PAN Card",emoji:"🔖",status:"completed",totalFee:283,submittedAt:new Date().toISOString(),sla:null,tracking:[
    {label:"Submitted",desc:"Sample request saved in the prototype.",date:"Sample update",done:true,active:false},
    {label:"Processing",desc:"Illustrative status only.",date:"Sample update",done:true,active:false},
    {label:"Completed",desc:"Demo journey completed; no official document was issued.",date:"Sample update",done:true,active:false},
  ]},
  {id:"SVO-DEMO-003",serviceName:"Income Certificate",emoji:"💰",status:"draft",totalFee:265,submittedAt:null,sla:null,tracking:[]},
];

const DOCUMENTS = [
  {id:"doc-001",name:"Aadhaar Card (Front)",status:"sample",expiry:null,bg:"#EEF4FF"},
  {id:"doc-002",name:"PAN Card",status:"sample",expiry:null,bg:"#FFF8ED"},
  {id:"doc-003",name:"Passport",status:"sample",expiry:"Aug 2029",bg:"#F0FDF4"},
  {id:"doc-004",name:"Voter ID",status:"pending",expiry:"Aug 2024",bg:"#FEF9C3"},
];

const NOTIFS_DATA = [
  {id:"n1",type:"app_update",title:"Demo Request Update",body:"A sample request is in the verification stage.",read:false,time:"2 min ago"},
  {id:"n2",type:"appointment",title:"Support Reminder",body:"Example support reminder for the interface demo.",read:false,time:"1 hr ago"},
  {id:"n3",type:"renewal",title:"⚠️ Document Expiring",body:"Your Example reminder shown for interface preview.",read:false,time:"3 hrs ago"},
  {id:"n4",type:"scheme",title:"Government Scheme",body:"Example scheme card; check official sources for current eligibility.",read:true,time:"1 day ago"},
  {id:"n5",type:"payment",title:"Estimate Preview",body:"Illustrative estimate only; no payment was collected.",read:true,time:"2 days ago"},
];

// ── Primitives ─────────────────────────────────────────────────────────────
const Icon = ({ name, size=20, color=C.text }) => {
  const icons = {
    home:House, file:FileText, folder:Folder, headset:Headphones, person:UserRound,
    back:ArrowLeft, search:Search, bell:Bell, check:Check, add:Plus, star:Star,
    shield:Shield, time:Clock3, forward:ChevronRight, chat:MessageCircle,
    logout:LogOut, settings:Settings, people:UsersRound, trending:TrendingUp,
    doc:FileText, info:Info, eye:Eye, briefcase:BriefcaseBusiness,
    idcard:IdCard, filebadge:FileBadge, building:Building2, wallet:Wallet,
    lightbulb:Lightbulb, sprout:Sprout, house:House, education:GraduationCap,
  };
  const Glyph = icons[name] || Info;
  return <Glyph size={size} color={color} strokeWidth={1.9} aria-hidden="true" style={{flexShrink:0}} />;
};

const serviceGlyphs = {
  "passport-fresh":IdCard, "pan-card":CreditCard,
  "income-certificate":FileBadge, "gst-registration":Receipt,
  "voter-id":Vote, "birth-certificate":Baby,
  "driving-licence":CarFront, "itr-filing":Calculator,
};
const serviceIdByName = {
  "Passport Application":"passport-fresh", "PAN Card":"pan-card",
  "Income Certificate":"income-certificate", "GST Registration":"gst-registration",
  "Voter ID (EPIC)":"voter-id", "Birth Certificate":"birth-certificate",
  "Driving Licence":"driving-licence", "ITR Filing":"itr-filing",
};
const ServiceIcon = ({serviceId,serviceName,size=23,color=C.primary}) => {
  const Glyph = serviceGlyphs[serviceId || serviceIdByName[serviceName]] || FileText;
  return <Glyph size={size} color={color} strokeWidth={1.8} aria-hidden="true" />;
};

const Bdg = ({label,bg,color,size=10}) => (
  <span style={{background:bg,color,fontSize:size,fontWeight:700,padding:"3px 9px",borderRadius:20,display:"inline-flex",alignItems:"center",whiteSpace:"nowrap"}}>{label}</span>
);

const Btn = ({label,onClick,variant="primary",full=false,size="md",disabled=false,loading=false}) => {
  const vs={primary:{bg:C.primary,c:"#fff",b:C.primary},secondary:{bg:C.primaryLight,c:C.primary,b:C.primary},ghost:{bg:"transparent",c:C.primary,b:C.border},danger:{bg:C.danger,c:"#fff",b:C.danger},success:{bg:C.success,c:"#fff",b:C.success}}[variant]||{bg:C.primary,c:"#fff",b:C.primary};
  const sz={sm:{p:"8px 14px",fs:12},md:{p:"12px 20px",fs:14},lg:{p:"15px 24px",fs:15}}[size];
  return <button onClick={!disabled&&!loading?onClick:undefined} style={{background:disabled?C.textDisabled:vs.bg,color:vs.c,border:`1px solid ${disabled?C.textDisabled:vs.b}`,borderRadius:13,padding:sz.p,fontSize:sz.fs,fontWeight:700,cursor:disabled||loading?"not-allowed":"pointer",width:full?"100%":"auto",display:"flex",alignItems:"center",justifyContent:"center",gap:8,minHeight:48,opacity:disabled?0.6:1,fontFamily:"inherit",boxShadow:variant==="primary"&&!disabled?"0 7px 16px rgba(21,94,239,.16)":"none"}}>{loading?"Loading...":label}</button>;
};

const Card = ({children,style={}}) => <div style={{background:C.card,borderRadius:17,padding:16,boxShadow:"0 8px 24px rgba(26,47,87,.055)",border:`1px solid ${C.border}`,...style}}>{children}</div>;
const DataState = ({loading,error,onRetry,label="data"}) => <Card style={{margin:"12px 0",textAlign:"center"}}>{loading?<div style={{fontSize:12,color:C.textSec}}>⏳ Loading {label}…</div>:<><div role="alert" style={{fontSize:12,color:C.danger,marginBottom:8}}>{error||`Could not load ${label}.`}</div>{onRetry&&<Btn label="Try again" onClick={onRetry} variant="secondary" size="sm"/>}</>}</Card>;
const PBar = ({value,max=100,h=6}) => <div style={{height:h,background:C.bgAlt,borderRadius:h/2,overflow:"hidden"}}><div style={{width:`${(value/max)*100}%`,height:"100%",background:C.primary,borderRadius:h/2,transition:"width .8s ease"}}/></div>;
const SBadge = ({status}) => {
  const cfg={draft:{l:"Draft",bg:C.bgAlt,c:C.textSec},submitted:{l:"Submitted",bg:C.primaryLight,c:C.primary},under_review:{l:"Under Review",bg:C.primaryLight,c:C.primary},verification:{l:"Verification",bg:C.saffronLight,c:C.saffron},govt_processing:{l:"Processing",bg:C.warningLight,c:C.warning},dispatched:{l:"Dispatched",bg:C.cyanLight,c:C.cyan},completed:{l:"Completed",bg:C.successLight,c:C.success},rejected:{l:"Rejected",bg:C.dangerLight,c:C.danger},verified:{l:"Verified",bg:C.successLight,c:C.success},sample:{l:"Sample",bg:C.primaryLight,c:C.primary},pending:{l:"Pending",bg:C.warningLight,c:C.warning}}[status]||{l:status,bg:C.bgAlt,c:C.textSec};
  return <Bdg label={cfg.l} bg={cfg.bg} color={cfg.c}/>;
};
const Phone = ({children,bg=C.bg,style={}}) => <div style={{width:"100%",height:"100%",background:bg,overflowY:"auto",overflowX:"hidden",fontFamily:"Inter,ui-sans-serif,system-ui,-apple-system,sans-serif",position:"relative",...style}}>{children}</div>;
const GH = ({children,style={}}) => <div style={{background:`linear-gradient(140deg,${C.primary},${C.primaryDark})`,padding:"16px 20px 20px",...style}}>{children}</div>;
const BB = ({onClick,light=false}) => <button onClick={onClick} style={{width:38,height:38,background:light?"rgba(255,255,255,.18)":C.bgAlt,border:"none",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><Icon name="back" size={20} color={light?"#fff":C.text}/></button>;

const TABS=[{id:"home",icon:"home",label:"Home"},{id:"applications",icon:"file",label:"Apply"},{id:"documents",icon:"folder",label:"Docs"},{id:"support",icon:"headset",label:"Help"},{id:"profile",icon:"person",label:"Profile"}];
const BNav = ({active,onNav,badge=0,docked=false}) => (
  <div className="seva-bottom-nav" style={{position:docked?"relative":"absolute",bottom:docked?"auto":0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",flexShrink:0,padding:"8px 0 20px",zIndex:20,boxShadow:"0 -4px 20px rgba(0,0,0,.06)"}}>
    {TABS.map(t=>{const ia=active===t.id;return <button key={t.id} onClick={()=>onNav(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,border:"none",background:"none",cursor:"pointer",padding:"4px 0"}}><div style={{width:36,height:30,borderRadius:10,background:ia?C.primaryLight:"transparent",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><Icon name={t.icon} size={20} color={ia?C.primary:C.textMuted}/>{t.id==="applications"&&badge>0&&<div style={{position:"absolute",top:-3,right:-3,width:16,height:16,background:C.saffron,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700,border:`2px solid ${C.white}`}}>{badge}</div>}</div><span style={{fontSize:10,fontWeight:700,color:ia?C.primary:C.textMuted}}>{t.label}</span></button>;})}
  </div>
);

// ── SCREENS ────────────────────────────────────────────────────────────────

const SplashScreen=({onNext})=>{
  const [p,setP]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setP(v=>{if(v>=100){clearInterval(iv);setTimeout(onNext,200);return 100;}return v+4;}),50);return()=>clearInterval(iv);},[]);
  return <div style={{height:"100%",minHeight:680,background:`linear-gradient(145deg,${C.primary},${C.primaryDark})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"48px 28px 40px"}}><div/><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,animation:"scaleIn .7s ease"}}><img src="/quickseva-mark.svg" alt="" style={{width:96,height:96,background:"#fff",borderRadius:28,padding:12,boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}/><div style={{textAlign:"center"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:38,fontWeight:800,color:"#fff",letterSpacing:-1}}>QuickSeva</div><div style={{fontSize:14,color:"rgba(255,255,255,.75)",marginTop:4}}>Independent service assistance · Demo</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:8}}>{["🏛️","📄","🎯","✅","🔐","📱"].map((e,i)=><div key={i} style={{width:60,height:60,background:"rgba(255,255,255,.12)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1px solid rgba(255,255,255,.15)"}}>{e}</div>)}</div></div><div style={{width:"100%",display:"flex",flexDirection:"column",gap:14}}><div style={{height:4,background:"rgba(255,255,255,.2)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:"#fff",borderRadius:4,transition:"width .05s linear"}}/></div><div style={{textAlign:"center",color:"rgba(255,255,255,.5)",fontSize:11}}>Independent service assistance</div></div></div>;
};

const WelcomeScreen=({onNext})=>{
  const [sl,setSl]=useState(0);
  const slides=[{emoji:"🏠",title:"Apply from Home",body:"Explore sample document-service preparation flows.",bg:"#EEF4FF",acc:C.primary},{emoji:"🎥",title:"Video Assistance",body:"View a sample assisted-service journey.",bg:"#FFF8ED",acc:C.saffron},{emoji:"📍",title:"Track Every Step",body:"Follow demo request statuses in the sample timeline.",bg:"#F0FDF4",acc:C.success}];
  const s=slides[sl];
  return <div style={{height:"100%",minHeight:680,background:s.bg,display:"flex",flexDirection:"column",padding:"20px 24px 32px"}}><button onClick={onNext} style={{alignSelf:"flex-end",background:"none",border:"none",fontSize:13,color:C.textSec,cursor:"pointer",fontWeight:700}}>Skip →</button><div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}><div style={{width:180,height:180,background:"#fff",borderRadius:44,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,boxShadow:`0 24px 64px ${s.acc}33`,animation:"bounce 3s infinite"}}>{s.emoji}</div><div style={{textAlign:"center"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:26,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:10}}>{s.title}</div><div style={{fontSize:15,color:C.textSec,lineHeight:1.65}}>{s.body}</div></div><div style={{display:"flex",gap:8}}>{slides.map((_,i)=><div key={i} onClick={()=>setSl(i)} style={{height:8,width:i===sl?28:8,borderRadius:4,background:i===sl?s.acc:C.border,transition:"all .3s",cursor:"pointer"}}/> )}</div></div><button onClick={sl<2?()=>setSl(v=>v+1):onNext} style={{width:"100%",padding:16,background:s.acc,color:"#fff",border:"none",borderRadius:18,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif"}}>{sl<2?"Next →":"Get Started 🚀"}</button></div>;
};

const LoginScreen=({onNext,onLogin})=>{
  const [mobile,setMobile]=useState("");const [step,setStep]=useState("phone");const [otp,setOtp]=useState(["","","","","",""]);const [loading,setLoading]=useState(false);const [error,setError]=useState("");const refs=useRef([]);
  const handleOtp=(val,i)=>{if(!/^\d*$/.test(val))return;const n=[...otp];n[i]=val.slice(-1);setOtp(n);if(val&&i<5)refs.current[i+1]?.focus();};
  const send=()=>{setError("");setOtp(["","","","","",""]);setStep("otp");};
  const verify=async(phone=mobile,code=otp.join(""),role="USER")=>{setLoading(true);setError("");try{await onLogin(phone,code,role);onNext(role);}catch(err){setError(err.message||"Demo sign-in failed.");}finally{setLoading(false);}};
  return <Phone><div style={{background:`linear-gradient(145deg,${C.primary},${C.primaryDark})`,padding:"28px 20px 44px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><img src="/quickseva-mark.svg" alt="" style={{width:64,height:64,background:"rgba(255,255,255,.18)",borderRadius:20,padding:9}}/><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:"#fff"}}>Welcome to QuickSeva</div><div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>Independent service assistance · Demo</div></div><div style={{background:C.white,borderRadius:"28px 28px 0 0",marginTop:-24,padding:"28px 20px 40px"}}>{step==="phone"?<div className="fade-up"><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>Enter Mobile Number</div><div style={{fontSize:13,color:C.textSec,marginBottom:20,lineHeight:1.5}}>Use the fictional demo account 5551234567, or choose a demo account below.</div><div style={{display:"flex",gap:10,marginBottom:14}}><div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"13px 14px",fontSize:14,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:5}}>🇮🇳 +91</div><input value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" inputMode="numeric" style={{flex:1,background:C.bg,border:`1.5px solid ${mobile.length===10?C.primary:C.border}`,borderRadius:14,padding:"13px 14px",fontSize:14,outline:"none",color:C.text,fontFamily:"inherit"}}/></div>{error&&<div role="alert" style={{fontSize:12,color:C.danger,marginBottom:10}}>{error}</div>}<Btn label="Continue to demo code" onClick={send} disabled={mobile.length<10} full size="lg"/><div style={{textAlign:"center",margin:"16px 0",color:C.textMuted,fontSize:12}}>— or —</div><button onClick={()=>verify("5551234567","123456")} style={{width:"100%",padding:"13px",border:`1.5px solid ${C.border}`,borderRadius:14,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:C.white,fontFamily:"inherit"}}>Continue with demo account</button><button onClick={()=>verify("5550000001","123456","WORKER")} style={{width:"100%",padding:"12px",marginTop:8,border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer",background:C.dark,color:"#fff"}}>Worker demo account · 123456</button></div>:<div className="fade-up" style={{textAlign:"center"}}><div style={{width:80,height:80,background:C.primaryLight,borderRadius:40,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px"}}>📱</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>Demo sign-in</div><div style={{fontSize:13,color:C.textSec,marginBottom:24}}>For fictional number +91 {mobile}</div><div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>{otp.map((d,i)=><input key={i} ref={el=>refs.current[i]=el} value={d} onChange={e=>handleOtp(e.target.value,i)} maxLength={1} inputMode="numeric" style={{width:44,height:52,textAlign:"center",fontSize:20,fontWeight:800,border:`2.5px solid ${d?C.primary:C.border}`,borderRadius:14,background:d?C.primaryLight:"#fff",outline:"none",color:C.primary,fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",transition:"all .2s"}}/>)}</div><div style={{background:C.primaryLight,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.primary,marginBottom:20,textAlign:"left"}}>Demo code: <strong>123456</strong>. No SMS is sent and no real number is verified.</div>{error&&<div role="alert" style={{fontSize:12,color:C.danger,marginBottom:10}}>{error}</div>}<Btn label={loading?"Verifying...":"Verify & Continue →"} onClick={()=>verify()} loading={loading} disabled={otp.join("").length!==6} full size="lg"/><button onClick={()=>setStep("phone")} style={{background:"none",border:"none",color:C.primary,fontWeight:600,cursor:"pointer",fontSize:13,marginTop:14}}>← Change number</button></div>}</div></Phone>;
};

const CATS=[{icon:"idcard",label:"Identity",bg:"#EEF4FF"},{icon:"filebadge",label:"Certs",bg:"#FFF8ED"},{icon:"building",label:"Business",bg:"#F0FDF4"},{icon:"wallet",label:"Tax",bg:"#FDF4FF"},{icon:"lightbulb",label:"Utilities",bg:"#FFFBEB"},{icon:"sprout",label:"Agri",bg:"#F0FDF4"},{icon:"house",label:"Land",bg:"#EFF6FF"},{icon:"education",label:"Education",bg:"#FEF9C3"}];

const HomeScreen=({onNav,notifs=[],services=SERVICES,applications=APPLICATIONS,applicationsLoading=false,applicationsError="",onRetryApplications})=>{
  const unread=notifs.filter(n=>!n.read).length;
  const popular=services.filter(s=>s.popular);
  const featured=services.find(s=>s.id==="passport-fresh")||popular[0]||SERVICES[0];
  const active=applications.filter(a=>!["completed","rejected","draft"].includes(a.status));
  const trackJourney=()=>active.length?onNav("tracking",active[0]):onNav("applications");
  const featureTitle=featured.id==="passport-fresh"?"Passport assistance":featured.name;
  return <Phone bg={C.bg}>
    <div style={{background:C.white,padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.borderLight}`,position:"relative",zIndex:2}}>
      <img src="/quickseva-wordmark.svg" alt="QuickSeva" style={{display:"block",width:142,height:32,objectFit:"contain",objectPosition:"left center"}}/>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button aria-label="Search services" onClick={()=>onNav("search")} style={{width:38,height:38,border:0,background:C.bg,borderRadius:19,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="search" size={18} color={C.textSec}/></button>
        <button aria-label="Notifications" onClick={()=>onNav("notifications")} style={{width:38,height:38,border:0,background:C.bg,borderRadius:19,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}><Icon name="bell" size={18} color={C.textSec}/>{unread>0&&<span style={{position:"absolute",top:2,right:2,width:8,height:8,borderRadius:4,background:C.primary,border:`2px solid ${C.white}`}}/>}</button>
        <button aria-label="Open profile" onClick={()=>onNav("profile")} style={{width:40,height:40,border:0,borderRadius:20,background:C.primaryLight,color:C.primary,fontSize:14,fontWeight:800,cursor:"pointer"}}>DA</button>
      </div>
    </div>
    <div style={{padding:"20px 20px 112px",display:"flex",flexDirection:"column",gap:24}}>
      <section style={{background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,borderRadius:27,padding:"26px 22px 25px",color:C.white,position:"relative",overflow:"hidden",minHeight:222,boxShadow:"0 14px 30px rgba(21,94,239,.18)"}}>
        <Sparkles aria-hidden="true" size={78} strokeWidth={1.1} style={{position:"absolute",right:18,top:50,color:"rgba(255,255,255,.20)"}}/>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:1.15,color:"rgba(255,255,255,.78)",marginBottom:12}}>GOOD MORNING, DEMO APPLICANT</div>
        <h1 style={{fontSize:25,lineHeight:1.14,fontWeight:850,letterSpacing:-.9,maxWidth:340,margin:0,position:"relative"}}>Government paperwork,<br/>sorted from home.</h1>
        <p style={{fontSize:15,lineHeight:1.55,color:"rgba(255,255,255,.88)",margin:"14px 0 0",maxWidth:300,position:"relative"}}>Get clear steps, friendly assistance, and progress you can follow.</p>
      </section>
      <div style={{display:"flex",alignItems:"center",gap:7,padding:"9px 12px",background:C.primaryLight,borderRadius:12,color:C.primary,fontSize:10,fontWeight:650,lineHeight:1.4}}><Icon name="shield" size={14} color={C.primary}/>Demo experience · no government services are connected.</div>
      <section>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}><div><h2 style={{fontSize:19,fontWeight:800,letterSpacing:-.35,color:C.text,margin:0}}>Continue your journey</h2><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{active.length?"Your latest request is ready to track":"Pick a service to get started"}</div></div><button onClick={trackJourney} style={{background:"none",border:0,color:C.primary,fontSize:14,fontWeight:750,cursor:"pointer",padding:"8px 0 8px 8px"}}>Track</button></div>
        {applicationsLoading&&active.length===0&&<Card><div style={{fontSize:12,color:C.textSec}}>Loading your demo applications…</div></Card>}
        {applicationsError&&active.length===0&&<Card><div role="alert" style={{fontSize:12,color:C.danger,marginBottom:8}}>{applicationsError}</div><Btn label="Retry" onClick={onRetryApplications} variant="secondary" size="sm"/></Card>}
        {active.length>0&&<button onClick={()=>onNav("tracking",active[0])} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px 15px",marginBottom:12,textAlign:"left",cursor:"pointer",boxShadow:"0 5px 18px rgba(20,35,61,.04)"}}><div><div style={{fontSize:9,fontWeight:800,letterSpacing:.8,color:C.textMuted,marginBottom:4}}>ACTIVE DEMO REQUEST</div><div style={{fontSize:13,fontWeight:750,color:C.text}}>{active[0].serviceName}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><SBadge status={active[0].status}/><Icon name="forward" size={16} color={C.primary}/></div></button>}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:23,padding:20,boxShadow:"0 8px 22px rgba(20,35,61,.05)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}><div style={{fontSize:10,fontWeight:850,letterSpacing:1,color:C.textMuted}}>POPULAR SERVICE</div><div style={{width:54,height:54,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center"}}><ServiceIcon serviceId={featured.id} size={26}/></div></div>
          <h3 style={{fontSize:21,lineHeight:1.2,letterSpacing:-.45,fontWeight:800,color:C.text,margin:"0 0 7px"}}>{featureTitle}</h3>
          <p style={{fontSize:13,lineHeight:1.55,color:C.textSec,margin:"0 0 15px"}}>Guidance with your application and documents.</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:17}}><span style={{background:C.primaryLight,color:C.primary,borderRadius:20,padding:"7px 11px",fontSize:10,fontWeight:750}}>From home</span><span style={{background:C.bgAlt,color:C.textSec,borderRadius:20,padding:"7px 11px",fontSize:10,fontWeight:750}}>Step-by-step help</span></div>
          <Btn label="View service" onClick={()=>onNav("detail",featured)} full size="lg"/>
        </div>
      </section>
      <section>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><h2 style={{fontSize:18,fontWeight:800,letterSpacing:-.3,color:C.text,margin:0}}>Browse services</h2><button onClick={()=>onNav("catalogue")} style={{background:"none",border:0,color:C.primary,fontSize:12,fontWeight:750,cursor:"pointer"}}>See all →</button></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:9}}>{CATS.map(c=><button key={c.label} onClick={()=>onNav("catalogue")} style={{background:C.white,border:`1px solid ${C.borderLight}`,borderRadius:16,padding:"13px 4px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer",boxShadow:"0 3px 12px rgba(20,35,61,.025)"}}><Icon name={c.icon} size={21} color={C.primary}/><span style={{fontSize:9,fontWeight:700,color:C.text,textAlign:"center"}}>{c.label}</span></button>)}</div>
      </section>
      <section>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}><h2 style={{fontSize:18,fontWeight:800,letterSpacing:-.3,color:C.text,margin:0}}>My applications</h2><button onClick={()=>onNav("applications")} style={{background:"none",border:0,color:C.primary,fontSize:12,fontWeight:750,cursor:"pointer"}}>See all →</button></div>
        {applications.slice(0,2).map(app=><button key={app.id} onClick={()=>app.status==="draft"?onNav("applications"):onNav("tracking",app)} style={{width:"100%",background:C.white,border:`1px solid ${C.border}`,borderRadius:17,padding:14,marginBottom:9,display:"flex",alignItems:"center",gap:11,textAlign:"left",cursor:"pointer",boxShadow:"0 4px 15px rgba(20,35,61,.03)"}}><div style={{width:42,height:42,borderRadius:13,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ServiceIcon serviceName={app.serviceName} size={21}/></div><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:750,color:C.text,marginBottom:3}}>{app.serviceName}</div><div style={{fontSize:10,color:C.textMuted}}>{app.submittedAt?new Date(app.submittedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"Draft · not submitted"}</div></div><SBadge status={app.status}/></button>)}
        {!applicationsLoading&&applications.length===0&&<Card><div style={{fontSize:12,color:C.textSec,marginBottom:8}}>No demo applications yet.</div><Btn label="Browse services" onClick={()=>onNav("catalogue")} variant="secondary" size="sm"/></Card>}
      </section>
      <div style={{background:C.white,border:`1px solid ${C.borderLight}`,borderRadius:18,padding:15,display:"flex",gap:11,alignItems:"flex-start"}}><div style={{width:34,height:34,background:C.primaryLight,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="info" size={17} color={C.primary}/></div><div><div style={{fontSize:11,fontWeight:800,color:C.text,marginBottom:4}}>Example scheme information</div><div style={{fontSize:11,fontWeight:700,color:C.textSec,marginBottom:3}}>PM Kisan Samman Nidhi</div><div style={{fontSize:10,lineHeight:1.5,color:C.textMuted}}>Illustrative only. Check official sources for current details.</div></div></div>
    </div>
    <BNav active="home" onNav={onNav} badge={applications.filter(a=>!["completed","rejected"].includes(a.status)).length}/>
  </Phone>;
};
const DetailScreen=({service,onApply,onBack,onNav})=>{
  const [faq,setFaq]=useState(null);
  const total=service.govtFee+service.platFee+service.gst;
  return <Phone><GH><div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}><BB onClick={onBack} light/><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:16,fontWeight:800,color:"#fff",flex:1}}>{service.name}</div></div><div style={{background:"rgba(255,255,255,.15)",borderRadius:16,padding:14,display:"flex",gap:14,alignItems:"center",border:"1px solid rgba(255,255,255,.2)"}}><div style={{fontSize:40}}>{service.emoji}</div><div><div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginBottom:5}}>{service.dept}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{service.popular&&<Bdg label="Popular" bg={C.saffron} color="#fff"/>}{service.tatkal&&<Bdg label="Tatkal Available" bg="rgba(255,255,255,.2)" color="#fff"/>}</div></div></div></GH>
  <div style={{padding:"14px 20px 120px",display:"flex",flexDirection:"column",gap:14}}>
    <div style={{background:C.warningLight,borderRadius:12,padding:"10px 12px",fontSize:11,color:"#92400e",lineHeight:1.5}}>Illustrative demo information only. Confirm current requirements, fees, and timelines with the relevant official department.</div>
    <div style={{background:C.white,borderRadius:16,padding:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>{[{l:"Total Fee",v:`₹${total.toLocaleString()}`,c:C.success},{l:"Timeline",v:service.days,c:C.primary},{l:"Category",v:service.cat,c:C.textSec}].map((s,i)=><div key={i} style={{textAlign:"center",padding:"6px 2px"}}><div style={{fontSize:13,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div><div style={{fontSize:10,color:C.textMuted}}>{s.l}</div></div>)}</div>
    <Card><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:13,fontWeight:800,color:C.text,marginBottom:10}}>Illustrative Demo Estimate</div>{[["Government Fee",service.govtFee===0?"Free":`₹${service.govtFee}`],["Platform Fee",`₹${service.platFee}`],["GST (18%)",`₹${service.gst}`]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.borderLight}`}}><span style={{fontSize:12,color:C.textSec}}>{k}</span><span style={{fontSize:12,fontWeight:600,color:C.text}}>{v}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",paddingTop:9}}><span style={{fontSize:14,fontWeight:800,color:C.text}}>Total</span><span style={{fontSize:14,fontWeight:800,color:C.primary}}>₹{total.toLocaleString()}</span></div></Card>
    <Card style={{display:"flex",gap:10,alignItems:"flex-start",background:C.successLight,borderColor:"#bbf7d0"}}><Icon name="check" size={16} color={C.success}/><div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{service.eligibility}</div></Card>
    <Card><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:13,fontWeight:800,color:C.text,marginBottom:10}}>Required Documents</div>{service.docs.map((d,i)=><div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",padding:"5px 0",borderBottom:i<service.docs.length-1?`1px solid ${C.borderLight}`:"none"}}><div style={{width:7,height:7,borderRadius:4,background:C.primary,marginTop:4,flexShrink:0}}/><span style={{fontSize:12,color:C.text,lineHeight:1.5}}>{d}</span></div>)}</Card>
    <Card><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:13,fontWeight:800,color:C.text,marginBottom:10}}>Application Steps</div>{service.steps.map((step,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<service.steps.length-1?10:0}}><div style={{width:24,height:24,borderRadius:12,background:i===0?C.primary:C.bgAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,fontWeight:800,color:i===0?"#fff":C.textMuted}}>{i+1}</span></div><span style={{fontSize:12,color:C.text,lineHeight:1.5,paddingTop:3}}>{step}</span></div>)}</Card>
    <div>{service.faqs.map((f,i)=><div key={i} onClick={()=>setFaq(faq===i?null:i)} style={{background:C.white,borderRadius:12,padding:"12px 14px",marginBottom:7,cursor:"pointer",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><span style={{fontSize:12,fontWeight:700,color:C.text,flex:1}}>{f.q}</span><span style={{color:C.primary,fontSize:16}}>{faq===i?"−":"+"}</span></div>{faq===i&&<div style={{fontSize:12,color:C.textSec,marginTop:8,lineHeight:1.6}}>{f.a}</div>}</div>)}</div>
  </div>
  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px 28px",background:`linear-gradient(transparent,${C.white} 25%)`,display:"flex",gap:10}}><Btn label="Talk to Expert" onClick={()=>onNav("support")} variant="secondary" size="md"/><div style={{flex:1}}><Btn label="Apply Now →" onClick={onApply} full size="md"/></div></div>
  </Phone>;
};

const WizardScreen=({service,onSubmit,onSaveDraft,onBack})=>{
  const [step,setStep]=useState(0);const [loading,setLoading]=useState(false);const [uploads,setUploads]=useState({});const [error,setError]=useState("");
  const STEPS=["Info","Docs","Check","Review","Submit"];const total=service.govtFee+service.platFee+service.gst;
  const upload=(doc)=>{setUploads(u=>({...u,[doc]:"loading"}));setTimeout(()=>setUploads(u=>({...u,[doc]:"done"})),1400);};
  const next=async()=>{if(step<4){setStep(s=>s+1);return;}setLoading(true);setError("");try{await onSubmit();}catch(err){setError(err.message||"Could not save this demo request.");}finally{setLoading(false);}};
  const saveDraft=async()=>{setLoading(true);setError("");try{await onSaveDraft();}catch(err){setError(err.message||"Could not save this draft.");}finally{setLoading(false);}};
  const body=()=>{
    if(step===0)return <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,marginBottom:3}}>Personal Information</div><div style={{fontSize:12,color:C.textSec,marginBottom:14}}>Sample applicant details</div><div style={{background:C.primaryLight,borderRadius:10,padding:"9px 12px",display:"flex",gap:7,alignItems:"center",marginBottom:14,border:`1px solid ${C.primaryMid}`}}><span style={{fontSize:14}}>✨</span><span style={{fontSize:11,color:C.primary}}>Fictional sample details only. Replace them with your own demo values.</span></div>{[["Full Name","RAHUL KUMAR"],["Date of Birth","15/08/1995"],["Gender","Male"],["Mobile","+91 5555555555"],["Email","rahul@email.com"]].map(([l,v])=><div key={l} style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:4}}>{l}</label><div style={{background:C.bg,border:`1.5px solid ${C.primaryLight}`,borderRadius:12,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:C.text}}>{v}</span><Bdg label="Sample" bg={C.primaryLight} color={C.primary} size={9}/></div></div>)}</div>;
    if(step===1)return <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,marginBottom:3}}>Document Checklist</div><div style={{fontSize:12,color:C.textSec,marginBottom:14}}>Select a sample file to mark the checklist item complete.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>{[{icon:"📋",label:"Checklist",bg:C.primaryLight},{icon:"📄",label:"Sample",bg:C.successLight},{icon:"🔐",label:"DigiLocker · demo",bg:C.saffronLight},{icon:"🔎",label:"Review",bg:"#EDE9FE"}].map(o=><button key={o.label} style={{background:o.bg,border:"none",borderRadius:14,padding:"14px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}><span style={{fontSize:24}}>{o.icon}</span><span style={{fontSize:11,fontWeight:700,color:C.text}}>{o.label}</span></button>)}</div>{service.docs.map((doc,i)=>{const s=uploads[doc]||"idle";return <div key={i} onClick={()=>s==="idle"&&upload(doc)} style={{background:C.white,border:`1.5px solid ${s==="done"?C.success:C.border}`,borderRadius:12,padding:"11px 13px",marginBottom:7,display:"flex",alignItems:"center",gap:10,cursor:s==="idle"?"pointer":"default"}}><div style={{width:38,height:38,background:s==="done"?C.successLight:C.bg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18}}>{s==="done"?"✅":s==="loading"?"⏳":"📄"}</span></div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:1}}>{doc}</div><div style={{fontSize:10,color:s==="done"?C.success:s==="loading"?C.primary:C.textMuted}}>{s==="done"?"Demo file selected":s==="loading"?"Uploading...":"Select sample item"}</div></div></div>;})}</div>;
    if(step===2)return <div style={{textAlign:"center"}}><div style={{width:80,height:80,background:C.primaryLight,borderRadius:40,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:36}}>🔍</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,marginBottom:7}}>Sample information check</div><div style={{fontSize:12,color:C.textSec,lineHeight:1.6,marginBottom:20}}>Checking that the demo form has the expected fields.</div>{[["Required field is present","done"],["Sample name is present","done"],["Photo quality check","done"],["Address cross-verification","active"],["Manual review placeholder","pending"]].map(([l,s],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,background:C.white,borderRadius:10,padding:"10px 14px",marginBottom:6,textAlign:"left",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}><div style={{width:26,height:26,borderRadius:13,background:s==="done"?C.successLight:s==="active"?C.primaryLight:C.bgAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1.5px solid ${s==="done"?C.success:s==="active"?C.primary:C.border}`}}>{s==="done"?<Icon name="check" size={13} color={C.success}/>:s==="active"?<span style={{fontSize:11,animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:null}</div><span style={{fontSize:12,color:s==="pending"?C.textMuted:C.text,fontWeight:s==="done"?600:400}}>{l}</span>{s==="done"&&<Bdg label="✓" bg={C.successLight} color={C.success} size={9}/>}</div>)}</div>;
    if(step===3)return <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,marginBottom:3}}>Review & Confirm</div><div style={{fontSize:12,color:C.textSec,marginBottom:14}}>Verify all details before submitting</div><Card style={{marginBottom:14}}>{[["Full Name","RAHUL KUMAR"],["Date of Birth","15 Aug 1995"],["Gender","Male"],["Mobile","+91 55512 34567"],["Application","Fresh / New"],["Processing",`Normal (${service.days})`]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.borderLight}`,gap:10}}><span style={{fontSize:12,color:C.textSec}}>{k}</span><span style={{fontSize:12,fontWeight:700,color:C.text,textAlign:"right"}}>{v}</span></div>)}</Card><div style={{background:C.warningLight,border:"1px solid #fde68a",borderRadius:12,padding:"12px 14px",display:"flex",gap:9,marginBottom:14}}><span style={{fontSize:16}}>⚠️</span><span style={{fontSize:11,color:"#92400e",lineHeight:1.5}}>Review your fictional sample details before saving this demo request.</span></div><div style={{display:"flex",gap:9,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:5,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><Icon name="check" size={12} color="#fff"/></div><span style={{fontSize:11,color:C.textSec,lineHeight:1.6}}>I declare all information is true and correct.</span></div></div>;
    if(step===4)return <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,marginBottom:8}}>Save demo request</div><div style={{fontSize:12,color:C.textSec,lineHeight:1.6,marginBottom:16}}>This creates a sample request in the QuickSeva demo so you can explore the tracking flow. It does not submit anything to a government department.</div><Card style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}><span style={{fontSize:12,color:C.textSec}}>Illustrative service estimate</span><strong style={{fontSize:14,color:C.text}}>₹{total.toLocaleString()}</strong></div><div style={{fontSize:10,color:C.textMuted}}>Displayed for prototype context only. No payment is collected.</div></Card><div style={{background:C.warningLight,border:"1px solid #fde68a",borderRadius:12,padding:"12px 14px",display:"flex",gap:9}}><span>ℹ️</span><span style={{fontSize:11,color:"#92400e",lineHeight:1.5}}>No official application, identity check, document upload, or payment occurs in this demo.</span></div></div>;
  };
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`,boxShadow:"0 1px 8px rgba(0,0,0,.04)"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><BB onClick={step>0?()=>setStep(s=>s-1):onBack}/><div style={{flex:1}}><div style={{fontSize:10,color:C.textMuted,marginBottom:4}}>{service.name} · Step {step+1} of 5</div><PBar value={step+1} max={5} h={5}/></div></div><div style={{display:"flex",justifyContent:"space-between"}}>{STEPS.map((s,i)=>{const done=i<step,active=i===step;return <div key={s} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:26,height:26,borderRadius:13,background:done?C.success:active?C.primary:C.bgAlt,border:`2px solid ${done?C.success:active?C.primary:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{done?<Icon name="check" size={11} color="#fff"/>:<span style={{fontSize:9,fontWeight:800,color:active?"#fff":C.textMuted}}>{i+1}</span>}</div><span style={{fontSize:8,fontWeight:700,color:active?C.primary:C.textMuted}}>{s}</span></div>;})}</div></div><div style={{padding:"18px 18px 120px",overflowY:"auto"}} className="fade-up">{body()}{error&&<div role="alert" style={{marginTop:12,padding:12,background:C.dangerLight,color:C.danger,borderRadius:10,fontSize:12}}>{error}</div>}</div><div className="seva-wizard-actions" style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px 28px",background:`linear-gradient(transparent,${C.bg} 25%)`}}>{step===4?<div style={{display:"flex",gap:9}}><Btn label="Save Draft" onClick={saveDraft} loading={loading} variant="secondary"/><div style={{flex:1}}><Btn label="Submit Demo Request →" onClick={next} loading={loading} full size="lg"/></div></div>:<Btn label={step===3?"Review Estimate →":"Continue →"} onClick={next} loading={loading} full size="lg"/>}</div></Phone>;
};

const SuccessScreen=({service,onTrack,onHome,application})=>{
  const total=service.govtFee+service.platFee+service.gst;
  return <Phone bg={C.successLight}><div style={{padding:"44px 22px 36px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}><div style={{width:100,height:100,borderRadius:50,background:`linear-gradient(135deg,${C.success},${C.successDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:20,boxShadow:`0 16px 48px ${C.success}44`,animation:"scaleIn .6s cubic-bezier(.34,1.56,.64,1)"}}>✅</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Demo request saved</div><div style={{fontSize:13,color:C.textSec,lineHeight:1.6,marginBottom:20}}>Saved to this QuickSeva prototype for exploring the sample tracking flow. Nothing was submitted to a government service.</div><div style={{background:C.white,borderRadius:16,padding:"13px 20px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,.08)",width:"100%"}}><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>Demo request ID</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:16,fontWeight:800,color:C.primary,marginBottom:6}}>{application?.id||"Saved in demo"}</div><div style={{fontSize:12,color:C.textSec}}>Illustrative estimate ₹{total.toLocaleString()} · No payment collected</div></div><div style={{background:C.warningLight,borderRadius:12,padding:"12px 14px",marginBottom:20,width:"100%",textAlign:"left",fontSize:11,color:"#92400e",lineHeight:1.5}}>Demo statuses are maintained by the sample worker dashboard. No real identity, document, payment, or government systems are involved.</div><div style={{width:"100%",display:"flex",flexDirection:"column",gap:9}}><Btn label="Track Demo Request →" onClick={onTrack} full size="lg"/><Btn label="Back to Home" onClick={onHome} full size="md" variant="ghost"/></div></div></Phone>;
};

const TrackingScreen=({application,onBack,onNav,loading=false,error="",onRetry})=>{
  const tracking=application?.tracking||[];
  const done=tracking.filter(t=>t.done).length;
  const prog=tracking.length?Math.round((done/tracking.length)*100):0;
  if(!application)return <Phone><GH><div style={{display:"flex",alignItems:"center",gap:11}}><BB onClick={onBack} light/><span style={{fontSize:16,fontWeight:800,color:"#fff"}}>Track Application</span></div></GH><div style={{padding:18}}>{loading?<DataState loading label="application"/>:error?<DataState error={error} onRetry={onRetry} label="application"/>:<Card>No application selected. Choose an application from your list to view its tracking timeline.</Card>}</div><BNav active="applications" onNav={onNav} docked/></Phone>;
  return <Phone style={{display:"flex",flexDirection:"column",overflowY:"hidden"}}><GH style={{flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}><BB onClick={onBack} light/><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:16,fontWeight:800,color:"#fff",flex:1}}>Track Application</span></div><div style={{background:"rgba(255,255,255,.15)",borderRadius:16,padding:14,border:"1px solid rgba(255,255,255,.2)"}}><div style={{fontSize:10,color:"rgba(255,255,255,.7)",marginBottom:3}}>Application ID</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:14,fontWeight:800,color:"#fff",marginBottom:7}}>{application.id.toUpperCase()}</div><div style={{display:"flex",gap:7}}><SBadge status={application.status}/><Bdg label={application.serviceName} bg="rgba(255,255,255,.2)" color="#fff" size={9}/></div></div></GH>
  <div style={{flex:"1 1 auto",minHeight:0,overflowY:"auto",padding:"14px 20px calc(94px + env(safe-area-inset-bottom))"}}><div style={{background:C.primaryLight,borderRadius:10,padding:"8px 10px",fontSize:10,color:C.primary,lineHeight:1.45,marginBottom:12}}>Sample tracking only. This request has not been submitted to a government department.</div><Card style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>Overall Progress</span><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:16,fontWeight:800,color:C.primary}}>{prog}%</span></div><PBar value={prog} h={7}/>{application.sla&&<div style={{fontSize:10,color:C.textMuted,marginTop:7}}>⏱ Est: {new Date(application.sla).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>}</Card>
  <div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>Status Timeline</div>
  {loading&&<div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Refreshing current status…</div>}{error&&<div role="alert" style={{padding:10,background:C.dangerLight,color:C.danger,borderRadius:10,fontSize:11,marginBottom:10}}>{error} <button onClick={onRetry} style={{border:0,background:"none",color:C.primary,fontWeight:800}}>Retry</button></div>}{tracking.length===0?<Card style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>Draft saved</div><div style={{fontSize:11,color:C.textSec,marginTop:4}}>Submit this draft to begin its demo status timeline.</div></Card>:tracking.map((t,i)=>{const isL=i===tracking.length-1;return <div key={i} style={{display:"flex",gap:14,position:"relative"}}>{!isL&&<div style={{position:"absolute",left:16,top:34,width:2,bottom:-8,background:t.done?C.success:C.border,zIndex:0}}/>}<div style={{width:32,height:32,borderRadius:16,flexShrink:0,background:t.done?C.success:t.active?C.primary:C.bgAlt,border:`2.5px solid ${t.done?C.success:t.active?C.primary:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,boxShadow:t.active?`0 0 16px ${C.primary}55`:"none"}}>{t.done?<Icon name="check" size={13} color="#fff"/>:t.active?<div style={{width:9,height:9,borderRadius:5,background:"#fff"}}/>:null}</div><div style={{flex:1,paddingBottom:i<tracking.length-1?18:0}}><div style={{display:"flex",justifyContent:"space-between",marginTop:5,gap:7}}><span style={{fontSize:13,fontWeight:t.active?800:700,color:t.active?C.primary:t.done?C.text:C.textMuted}}>{t.label}</span><span style={{fontSize:9,color:C.textMuted,flexShrink:0}}>{t.date||"Upcoming"}</span></div><div style={{fontSize:11,color:t.active?C.textSec:C.textMuted,lineHeight:1.5}}>{t.desc}</div>{t.active&&<div style={{display:"inline-flex",alignItems:"center",gap:5,background:C.primaryLight,borderRadius:7,padding:"3px 9px",marginTop:5}}><div style={{width:5,height:5,borderRadius:3,background:C.primary,animation:"pulse 1s infinite"}}/><span style={{fontSize:10,color:C.primary,fontWeight:700}}>Demo status · refreshes automatically</span></div>}</div></div>;})}
  <div style={{display:"flex",gap:9,marginTop:18}}><button onClick={()=>onNav("support")} style={{flex:1,padding:"11px 0",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12,fontWeight:700,color:C.text,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon name="chat" size={14} color={C.text}/>Chat</button><button onClick={()=>onNav("support")} style={{flex:1,padding:"11px 0",background:C.primary,border:"none",borderRadius:12,fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>📞 Support</button></div>
  </div><BNav active="applications" onNav={onNav} docked/></Phone>;
};

const AppsScreen=({onAppPress,onNew,onNav,onSubmitDraft,applications=APPLICATIONS,loading=false,error="",onRetry})=>{
  const [filter,setFilter]=useState("All");
  const [draftBusy,setDraftBusy]=useState("");const [draftError,setDraftError]=useState("");
  const submitDraft=async(app)=>{setDraftBusy(app.id);setDraftError("");try{await onSubmitDraft(app);}catch(e){setDraftError(e.message||"Could not submit this draft.");}finally{setDraftBusy("");}};
  const filtered=applications.filter(a=>{if(filter==="All")return true;if(filter==="Active")return!["completed","rejected","draft"].includes(a.status);if(filter==="Done")return a.status==="completed";if(filter==="Draft")return a.status==="draft";return true;});
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text}}>My Applications</div><button onClick={onNew} style={{width:36,height:36,background:C.primaryLight,border:"none",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="add" size={20} color={C.primary}/></button></div><div style={{display:"flex",gap:7}}>{["All","Active","Done","Draft"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${filter===f?C.primary:C.border}`,background:filter===f?C.primary:C.white,color:filter===f?"#fff":C.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>{f}</button>)}</div></div>
  <div style={{padding:"14px 18px 100px"}}>{draftError&&<div role="alert" style={{padding:10,marginBottom:10,background:C.dangerLight,color:C.danger,borderRadius:10,fontSize:12}}>{draftError}</div>}{loading?<DataState loading label="applications"/>:error?<DataState error={error} onRetry={onRetry} label="applications"/>:filtered.length===0?<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:44,marginBottom:12}}>📋</div><div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6}}>No Applications</div><div style={{fontSize:13,color:C.textSec,marginBottom:18}}>Start your first service</div><Btn label="Browse Services" onClick={onNew} size="md"/></div>:filtered.map(app=><div key={app.id} onClick={()=>app.status!=="draft"&&onAppPress(app)} style={{background:C.white,borderRadius:16,padding:14,marginBottom:9,boxShadow:"0 2px 16px rgba(0,0,0,.07)",border:`1px solid ${C.borderLight}`,cursor:app.status==="draft"?"default":"pointer"}}><div style={{display:"flex",alignItems:"center",gap:11,marginBottom:7}}><div style={{width:44,height:44,background:C.primaryLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}><ServiceIcon serviceName={app.serviceName} size={23}/></div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:2}}>{app.serviceName}</div><div style={{fontSize:10,color:C.textMuted}}>{app.submittedAt?new Date(app.submittedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"Draft · not submitted"}</div></div><SBadge status={app.status}/></div>{app.status==="draft"?<Btn label={draftBusy===app.id?"Submitting…":"Submit demo draft"} onClick={()=>submitDraft(app)} loading={draftBusy===app.id} full size="sm"/>:app.govtRef&&<div style={{fontSize:10,color:C.textSec,marginBottom:5}}>Ref: {app.govtRef}</div>}{!["draft","completed"].includes(app.status)&&<PBar value={{submitted:20,under_review:35,verification:50,govt_processing:70,dispatched:90}[app.status]||0}/>}</div>)}</div>
  <button onClick={onNew} style={{position:"absolute",bottom:84,right:18,width:52,height:52,borderRadius:26,background:C.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 24px ${C.primary}44`,zIndex:10}}><Icon name="add" size={24} color="#fff"/></button>
  <BNav active="applications" onNav={onNav}/></Phone>;
};

const DocsScreen=({onNav})=><Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text}}>My Documents</div><div style={{display:"flex",alignItems:"center",gap:5,background:C.primaryLight,borderRadius:20,padding:"4px 10px"}}><Icon name="shield" size={12} color={C.primary}/><span style={{fontSize:10,fontWeight:700,color:C.primary}}>Demo checklist</span></div></div><div style={{padding:"14px 18px 110px"}}><div style={{background:`linear-gradient(135deg,${C.primary},#1a73e8)`,borderRadius:16,padding:14,marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#fff",fontWeight:700,fontSize:13}}>Sample checklist</span><span style={{color:"rgba(255,255,255,.75)",fontSize:12}}>No files stored</span></div><div style={{height:5,background:"rgba(255,255,255,.25)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:"4.2%",background:"#fff",borderRadius:3}}/></div><div style={{fontSize:10,color:"rgba(255,255,255,.6)",marginTop:7}}>Sample items only · uploads are not enabled</div></div><div style={{background:C.warningLight,border:"1px solid #fde68a",borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>⏰</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:C.warning,marginBottom:1}}>Renewal Reminder</div><div style={{fontSize:11,color:"#92400e",lineHeight:1.4}}>Example reminder shown for interface preview.</div></div><button style={{background:"none",border:"none",color:C.warning,fontWeight:700,fontSize:11,cursor:"pointer"}} disabled title="Renewals are not connected">Preview only</button></div>{DOCUMENTS.map((doc,i)=><div key={doc.id} style={{background:C.white,borderRadius:16,padding:"12px 14px",marginBottom:9,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:`1px solid ${C.borderLight}`,cursor:"default",animation:`fadeUp .3s ease ${i*.05}s both`}}><div style={{width:48,height:48,background:doc.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📄</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:2}}>{doc.name}</div>{doc.expiry&&<div style={{fontSize:10,color:C.textMuted}}>Exp: {doc.expiry}</div>}</div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}><SBadge status={doc.status}/><Icon name="eye" size={15} color={C.textMuted}/></div></div>)}<button style={{width:"100%",padding:"12px",border:`1.5px dashed ${C.primary}`,borderRadius:14,background:C.primaryLight,fontSize:13,fontWeight:700,color:C.primary,cursor:"not-allowed",opacity:0.65,display:"flex",alignItems:"center",justifyContent:"center",gap:7}} disabled title="Document uploads are not available in this demo"><Icon name="add" size={16} color={C.primary}/><span>Uploads unavailable in demo</span></button></div><BNav active="documents" onNav={onNav}/></Phone>;

const SupportScreen=({onNav})=>{
  const [faq,setFaq]=useState(null);
  const faqs=[{q:"Passport timeline?",a:"Fresh: 25–30 working days. Tatkal: 7 days after police verification."},{q:"Apply for family?",a:"Yes — add family members in profile and switch before applying."},{q:"Document rejected?",a:"This prototype does not inspect documents or prevent application rejections."},{q:"Refunds?",a:"No payments or refunds are processed in this demo."},{q:"Reschedule call?",a:"Bookings are not connected in this demo."}];
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text}}>Help & Support</div></div><div style={{padding:"14px 18px 110px"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>{[{icon:"💬",label:"Live Chat",sub:"Sample support channel",bg:C.primaryLight,badge:"Demo"},{icon:"🎥",label:"Video Help",sub:"Not connected",bg:C.saffronLight,badge:"Preview"},{icon:"📞",label:"Call Support",sub:"Demo contact not connected",bg:C.successLight,badge:"Demo"},{icon:"🎫",label:"Raise Ticket",sub:"Tickets are not saved",bg:"#EDE9FE",badge:"Preview"}].map(ch=><div key={ch.label} style={{background:ch.bg,borderRadius:16,padding:"16px 12px",position:"relative",cursor:"default"}}>{ch.badge&&<div style={{position:"absolute",top:9,right:9,background:C.success,borderRadius:20,padding:"1px 7px"}}><span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{ch.badge}</span></div>}<div style={{width:42,height:42,background:C.white,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:9}}>{ch.icon}</div><div style={{fontWeight:800,fontSize:12,color:C.text,marginBottom:1}}>{ch.label}</div><div style={{fontSize:10,color:C.textSec}}>{ch.sub}</div></div>)}</div><div style={{background:C.white,borderRadius:16,padding:14,marginBottom:18,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontWeight:800,fontSize:13,color:C.text}}>My Tickets</span><Bdg label="1 Open" bg={C.warningLight} color={C.warning}/></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:40,height:40,background:C.saffronLight,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎫</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:1}}>#TKT-2024-089 – Photo Rejection</div><div style={{fontSize:10,color:C.textSec}}>Opened 2 hrs ago · Illustrative sample ticket</div></div></div></div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:14,fontWeight:800,color:C.text,marginBottom:10}}>Frequently Asked</div>{faqs.map((f,i)=><div key={i} onClick={()=>setFaq(faq===i?null:i)} style={{background:C.white,borderRadius:12,padding:"12px 14px",marginBottom:7,cursor:"pointer",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><span style={{fontSize:12,fontWeight:600,color:C.text,flex:1}}>{f.q}</span><span style={{color:C.primary,fontSize:16}}>{faq===i?"−":"+"}</span></div>{faq===i&&<div style={{fontSize:11,color:C.textSec,marginTop:8,lineHeight:1.6}}>{f.a}</div>}</div>)}<div style={{background:C.dark,borderRadius:16,padding:14,display:"flex",alignItems:"center",gap:10,marginTop:4}}><div style={{width:48,height:48,background:"rgba(255,255,255,.08)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🤖</div><div style={{flex:1}}><div style={{fontWeight:800,fontSize:12,color:"#fff",marginBottom:2}}>SevaBot — Sample Assistant</div><div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Static preview only. No AI chat or live support is connected.</div></div><button style={{background:C.primary,border:"none",borderRadius:9,padding:"7px 11px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}} disabled title="Live chat is not connected">Chat preview only</button></div></div><BNav active="support" onNav={onNav}/></Phone>;
};

const ProfileScreen=({onNav,onLogout})=>{
  const menu=[{title:"Account",items:[{icon:"person",label:"Personal Information",sub:"Name, DOB, address"},{icon:"people",label:"Family Members",sub:"2 members"},{icon:"briefcase",label:"Payment History",sub:"No payments in this demo"},{icon:"star",label:"Seva Points",sub:"Not enabled in this demo"},{icon:"trending",label:"Referral Program",sub:"Preview only"}]},{title:"Preferences",items:[{icon:"bell",label:"Notifications",sub:"Push, SMS, Email",fn:()=>onNav("notifications")},{icon:"settings",label:"Settings",sub:"Privacy, security"},{icon:"info",label:"Language",sub:"English"}]},{title:"Support",items:[{icon:"headset",label:"Help Center",sub:"FAQs and guides"},{icon:"shield",label:"Privacy Policy",sub:"How we use your data"},{icon:"doc",label:"Terms",sub:"Usage terms"}]}];
  return <Phone><div style={{background:`linear-gradient(145deg,${C.primary},#1a73e8)`,padding:"20px 18px 52px"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:"#fff"}}>Profile</div></div><div style={{padding:"0 18px 110px"}}><div style={{background:C.white,borderRadius:22,padding:"24px 18px",textAlign:"center",marginTop:-28,boxShadow:"0 8px 32px rgba(0,0,0,.1)",marginBottom:10}}><div style={{position:"relative",display:"inline-block",marginBottom:10}}><div style={{width:76,height:76,borderRadius:38,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,border:`3px solid ${C.primary}`,margin:"0 auto",fontWeight:800,color:C.primary}}>D</div><div style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderRadius:10,background:C.success,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="check" size={10} color="#fff"/></div></div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text,marginBottom:3}}>Demo Applicant</div><div style={{fontSize:12,color:C.textSec,marginBottom:8}}>+91 55512 34567</div><div style={{display:"flex",gap:7,justifyContent:"center"}}><Bdg label="Demo profile" bg={C.successLight} color={C.success} size={9}/><Bdg label="Free Plan" bg={C.bgAlt} color={C.textSec} size={9}/></div></div><div style={{background:C.white,borderRadius:16,padding:14,display:"grid",gridTemplateColumns:"repeat(4,1fr)",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>{[{v:3,l:"Apps",c:C.primary},{v:1,l:"Done",c:C.success},{v:1,l:"Active",c:C.saffron},{v:0,l:"Points",c:C.warning}].map(s=><div key={s.l} style={{textAlign:"center"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:9,color:C.textMuted}}>{s.l}</div></div>)}</div><div style={{background:C.dark,borderRadius:16,padding:14,display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,color:"#fff",marginBottom:2}}>⚡ Upgrade to Gold</div><div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Unlimited services · Demo features only</div></div><button disabled title="Membership is not available in the demo" style={{background:C.saffron,border:"none",borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:800,color:"#fff",cursor:"not-allowed",flexShrink:0,opacity:0.65}}>Preview only</button></div>{menu.map(sec=><div key={sec.title} style={{marginBottom:10}}><div style={{fontSize:10,fontWeight:800,color:C.textMuted,textTransform:"uppercase",letterSpacing:.8,marginBottom:6,paddingLeft:2}}>{sec.title}</div><div style={{background:C.white,borderRadius:16,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>{sec.items.map((item,i)=><div key={item.label} onClick={item.fn} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",borderBottom:i<sec.items.length-1?`1px solid ${C.borderLight}`:"none",cursor:item.fn?"pointer":"default"}}><div style={{width:34,height:34,background:C.primaryLight,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={item.icon} size={16} color={C.primary}/></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text,marginBottom:1}}>{item.label}</div><div style={{fontSize:10,color:C.textMuted}}>{item.sub}</div></div><Icon name="forward" size={14} color={C.textMuted}/></div>)}</div></div>)}<button onClick={onLogout} style={{width:"100%",padding:"13px",background:C.dangerLight,border:"1px solid #fca5a5",borderRadius:14,fontSize:13,fontWeight:700,color:C.danger,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginTop:4}}><Icon name="logout" size={16} color={C.danger}/>Logout</button><div style={{textAlign:"center",fontSize:10,color:C.textMuted,marginTop:10}}>QuickSeva v1.0.0 · Made in India 🇮🇳</div></div><BNav active="profile" onNav={onNav}/></Phone>;
};

const NotifsScreen=({onBack,notifs,onMark})=>{
  const ICON={app_update:"📋",appointment:"📅",renewal:"⏰",scheme:"💡",payment:"✅",system:"🔔"};
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><BB onClick={onBack}/><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text,flex:1}}>Notifications</span><button onClick={()=>onMark("all")} style={{background:"none",border:"none",color:C.primary,fontSize:11,fontWeight:700,cursor:"pointer"}}>Mark all read</button></div></div><div style={{padding:"14px 18px 40px",display:"flex",flexDirection:"column",gap:7}}>{notifs.map((n,i)=><div key={n.id} style={{background:n.read?C.white:C.primaryLight,border:`1px solid ${n.read?C.borderLight:"#c7d7fd"}`,borderRadius:14,padding:"12px 14px",display:"flex",gap:10,animation:`fadeUp .3s ease ${i*.05}s both`,cursor:"pointer"}} onClick={()=>onMark(n.id)}><div style={{width:42,height:42,background:n.read?C.bgAlt:C.primary,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ICON[n.type]||"🔔"}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3,gap:7}}><span style={{fontSize:12,fontWeight:n.read?600:800,color:C.text,flex:1}}>{n.title}</span><span style={{fontSize:10,color:C.textMuted,flexShrink:0}}>{n.time}</span></div><div style={{fontSize:11,color:C.textSec,lineHeight:1.5}}>{n.body}</div></div>{!n.read&&<div style={{width:7,height:7,borderRadius:4,background:C.primary,marginTop:3,flexShrink:0}}/>}</div>)}</div></Phone>;
};

const SearchScreen=({onServicePress,onBack,services=SERVICES})=>{
  const [q,setQ]=useState("");
  const results=q.length>1?services.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.cat.toLowerCase().includes(q.toLowerCase())):[];
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}><BB onClick={onBack}/><div style={{flex:1,background:C.bg,borderRadius:12,padding:"9px 14px",display:"flex",alignItems:"center",gap:7,border:`1px solid ${C.border}`}}><Icon name="search" size={16} color={C.textMuted}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search services..." style={{border:"none",background:"none",outline:"none",fontSize:13,color:C.text,flex:1,fontFamily:"inherit"}}/>{q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.textMuted}}>✕</button>}</div></div><div style={{padding:"14px 18px 40px"}}>{q.length<2?<div><div style={{fontWeight:800,fontSize:13,color:C.text,marginBottom:10}}>Recent Searches</div>{["Passport Application","Income Certificate","PAN Card"].map(r=><div key={r} onClick={()=>setQ(r)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`,cursor:"pointer"}}><Icon name="time" size={16} color={C.textMuted}/><span style={{flex:1,fontSize:13,color:C.text}}>{r}</span><span style={{fontSize:12,color:C.textMuted,transform:"rotate(45deg)",display:"inline-block"}}>↑</span></div>)}<div style={{fontWeight:800,fontSize:13,color:C.text,marginTop:18,marginBottom:10}}>Trending</div><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["GST Registration","Voter ID","Birth Certificate","Driving Licence","ITR Filing"].map(t=>{const svc=services.find(s=>s.name===t);return <button key={t} onClick={()=>svc&&onServicePress(svc)} style={{background:C.primaryLight,border:`1px solid ${C.primaryMid}`,borderRadius:20,padding:"6px 12px",fontSize:11,fontWeight:600,color:C.primary,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Icon name="trending" size={11} color={C.primary}/>{t}</button>;})} </div></div>:<div><div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>{results.length} result{results.length!==1?"s":""} for "{q}"</div>{results.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:44,marginBottom:10}}>🔍</div><div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:5}}>No results</div><div style={{fontSize:12,color:C.textSec}}>Try different keywords</div></div>:results.map(svc=><div key={svc.id} onClick={()=>onServicePress(svc)} style={{background:C.white,borderRadius:16,padding:14,marginBottom:9,display:"flex",alignItems:"center",gap:10,boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:`1px solid ${C.borderLight}`,cursor:"pointer"}}><div style={{width:46,height:46,background:C.primaryLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}><ServiceIcon serviceId={svc.id} size={24}/></div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:2}}>{svc.name}</div><div style={{fontSize:10,color:C.textSec}}>{svc.cat} · ₹{(svc.govtFee+svc.platFee+svc.gst).toLocaleString()} · {svc.days}</div></div><Icon name="forward" size={16} color={C.textMuted}/></div>)}</div>}</div></Phone>;
};

const CatalogueScreen=({onServicePress,onBack,services=SERVICES,loading=false,error="",onRetry})=>{
  const [cat,setCat]=useState("All");const [search,setSearch]=useState("");
  const filtered=services.filter(s=>(cat==="All"||s.cat===cat)&&(!search||s.name.toLowerCase().includes(search.toLowerCase())));
  return <Phone><div style={{background:C.white,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><BB onClick={onBack}/><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:C.text,flex:1}}>All Services</span></div><div style={{background:C.bg,borderRadius:12,padding:"9px 14px",display:"flex",alignItems:"center",gap:7,border:`1px solid ${C.border}`,marginBottom:10}}><Icon name="search" size={15} color={C.textMuted}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services..." style={{border:"none",background:"none",outline:"none",fontSize:13,color:C.text,flex:1,fontFamily:"inherit"}}/></div><div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:3,scrollbarWidth:"none"}}>{["All","Identity","Certificates","Business","Tax"].map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${cat===c?C.primary:C.border}`,background:cat===c?C.primary:C.white,color:cat===c?"#fff":C.text,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>{c}</button>)}</div></div><div style={{padding:"10px 18px 40px",display:"flex",flexDirection:"column",gap:9}}>{loading?<DataState loading label="services"/>:error?<DataState error={error} onRetry={onRetry} label="services"/>:filtered.length===0?<Card>No services match this filter.</Card>:<><div style={{fontSize:11,color:C.textMuted}}>{filtered.length} services</div>{filtered.map((svc,i)=><div key={svc.id} onClick={()=>onServicePress(svc)} style={{background:C.white,borderRadius:16,padding:14,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:`1px solid ${C.borderLight}`,cursor:"pointer",animation:`fadeUp .3s ease ${i*.04}s both`}}><div style={{width:48,height:48,background:C.primaryLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}><ServiceIcon serviceId={svc.id} size={24}/></div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontWeight:700,fontSize:13,color:C.text}}>{svc.name}</span>{svc.popular&&<Bdg label="Popular" bg={C.saffronLight} color={C.saffron} size={9}/>}</div><div style={{fontSize:10,color:C.textMuted,marginBottom:4}}>{svc.dept}</div><div style={{display:"flex",gap:7}}><Bdg label={svc.govtFee===0?"Free":`₹${(svc.govtFee+svc.platFee+svc.gst).toLocaleString()}`} bg={C.successLight} color={C.success} size={10}/><Bdg label={`⏱ ${svc.days}`} bg={C.bgAlt} color={C.textSec} size={10}/></div></div><Icon name="forward" size={16} color={C.textMuted}/></div>)}</>}</div></Phone>;
};

const WorkerScreen=({onBack})=>{
  const [online,setOnline]=useState(true);const [tab,setTab]=useState("jobs");
  const JOBS=[{t:"10:00 AM",c:"Arun Singh",s:"Passport Docs",type:"Video",next:true},{t:"12:30 PM",c:"Meena Devi",s:"Income Cert.",type:"Visit",next:false},{t:"3:00 PM",c:"Raj Patel",s:"GST Reg.",type:"Video",next:false}];
  const BARS=[60,80,45,90,75,100,65];
  return <Phone><div style={{background:`linear-gradient(145deg,${C.dark},${C.dark2})`,padding:"18px 18px 24px"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><BB onClick={onBack} light/><div style={{flex:1}}><div style={{fontSize:10,color:C.textMuted,marginBottom:1}}>Worker Portal</div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>Demo worker profile</div></div><button onClick={()=>setOnline(o=>!o)} style={{background:online?C.success:C.dark3,border:"none",borderRadius:20,padding:"5px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}><div style={{width:7,height:7,borderRadius:4,background:"#fff",animation:online?"pulse 1s infinite":"none"}}/><span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{online?"Online":"Offline"}</span></button></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>{[["3","Today's Jobs",C.primary],["₹2,100","Earned",C.success],["4.9 ⭐","Rating",C.saffron]].map(([v,l,c])=><div key={l} style={{background:"rgba(255,255,255,.08)",borderRadius:12,padding:"10px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,.06)"}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#fff",fontSize:16,fontWeight:800,marginBottom:1}}>{v}</div><div style={{color:C.textMuted,fontSize:9}}>{l}</div></div>)}</div></div><div style={{padding:"8px 18px",background:C.warningLight,color:C.warning,fontSize:10,fontWeight:700}}>Sample schedule and earnings only · no jobs or payouts are real.</div><div style={{background:C.white,display:"flex",borderBottom:`1px solid ${C.border}`}}>{["jobs","earnings"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px 0",border:"none",background:"none",fontWeight:700,fontSize:12,color:t===tab?C.primary:C.textMuted,borderBottom:`2px solid ${t===tab?C.primary:"transparent"}`,cursor:"pointer"}}>{t==="jobs"?"Today's Schedule":"Earnings"}</button>)}</div><div style={{padding:"14px 18px 40px"}}>{tab==="jobs"?<div style={{display:"flex",flexDirection:"column",gap:9}}>{JOBS.map((j,i)=><div key={i} style={{background:C.white,borderRadius:16,padding:"13px 14px",display:"flex",gap:10,alignItems:"center",boxShadow:"0 2px 12px rgba(0,0,0,.06)",border:`1px solid ${C.borderLight}`}}><div style={{minWidth:52,textAlign:"center"}}><span style={{fontSize:12,fontWeight:800,color:j.next?C.primary:C.textSec}}>{j.t}</span></div><div style={{width:1,height:40,background:C.border}}/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:1}}>{j.c}</div><div style={{fontSize:10,color:C.textSec,marginBottom:5}}>{j.s}</div><div style={{display:"flex",gap:5}}><Bdg label={j.type==="Video"?"📹 Video":"🏠 Visit"} bg={j.type==="Video"?C.primaryLight:C.saffronLight} color={j.type==="Video"?C.primary:C.saffron} size={9}/>{j.next&&<Bdg label="Up Next" bg={C.successLight} color={C.success} size={9}/>}</div></div><button style={{width:32,height:32,background:C.primaryLight,border:"none",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="forward" size={16} color={C.primary}/></button></div>)}</div>:<div><Card style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,fontWeight:600,color:C.textSec}}>This Week</span><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.success}}>₹12,450</span></div><div style={{display:"flex",alignItems:"flex-end",height:64,gap:3}}>{BARS.map((h,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:"100%",height:h*.6,background:i===5?C.primary:C.primaryLight,borderRadius:3,minHeight:3}}/><span style={{fontSize:8,color:C.textMuted}}>{" SMTWTFS"[i+1]}</span></div>)}</div></Card>{[["Video Calls (12)","₹7,200"],["Home Visits (3)","₹3,750"],["Bonuses","₹1,500"]].map(([l,v])=><div key={l} style={{background:C.white,borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}><span style={{fontSize:12,color:C.textSec}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:C.success}}>{v}</span></div>)}<button disabled title="Payouts are not available in the demo" style={{width:"100%",padding:"13px",background:C.success,border:"none",borderRadius:14,fontSize:13,fontWeight:800,color:"#fff",cursor:"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginTop:7,opacity:0.65}}>Payouts unavailable · demo preview</button></div>}<div style={{marginTop:18}}><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:14,fontWeight:800,color:C.text,marginBottom:10}}>Performance</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{[{e:"🏆",l:"Jobs Done",v:"47",bg:C.primaryLight},{e:"⭐",l:"Avg Rating",v:"4.9",bg:C.saffronLight},{e:"⏱️",l:"On Time %",v:"98%",bg:C.successLight},{e:"✅",l:"Completion",v:"100%",bg:C.successLight}].map(p=><div key={p.l} style={{background:p.bg,borderRadius:14,padding:"13px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:22}}>{p.e}</span><span style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",fontSize:20,fontWeight:800,color:C.text}}>{p.v}</span><span style={{fontSize:9,color:C.textMuted}}>{p.l}</span></div>)}</div></div></div></Phone>;
};

const DemoWorkerScreen=({onBack,applications,onUpdate,loading=false,queueError="",onRefresh})=>{
  const [busy,setBusy]=useState("");const [error,setError]=useState("");
  const [workspacePreview,setWorkspacePreview]=useState(false);
  const stages=["under_review","verification","govt_processing","dispatched","completed"];
  const next={submitted:"under_review",under_review:"verification",verification:"govt_processing",govt_processing:"dispatched",dispatched:"completed"};
  const update=async(app)=>{setBusy(app.id);setError("");try{await onUpdate(app.id,next[app.status]||"under_review");}catch(e){setError(e.message||"Could not update demo status.");}finally{setBusy("");}};
  if(workspacePreview)return <WorkerScreen onBack={()=>setWorkspacePreview(false)}/>;
  return <Phone><div style={{background:`linear-gradient(145deg,${C.dark},${C.dark2})`,padding:"20px 18px",color:"#fff"}}><div style={{display:"flex",alignItems:"center",gap:10}}><BB onClick={onBack} light/><div><div style={{fontSize:10,color:C.textMuted}}>Worker / admin demo</div><div style={{fontSize:18,fontWeight:800}}>Request queue</div></div></div><div style={{fontSize:11,color:"#cbd5e1",marginTop:12}}>Advance sample request statuses for the portfolio walkthrough.</div></div><div style={{padding:"14px 18px 40px",overflowY:"auto"}}><div style={{display:"flex",gap:8}}><div style={{flex:1}}><Btn label="Schedule & earnings preview →" onClick={()=>setWorkspacePreview(true)} full size="md"/></div><button onClick={onRefresh} aria-label="Refresh request queue" style={{border:`1px solid ${C.border}`,background:C.white,borderRadius:13,padding:"0 14px",fontSize:18,color:C.primary}}>↻</button></div>{(queueError||error)&&<div role="alert" style={{padding:10,marginTop:10,marginBottom:10,background:C.dangerLight,color:C.danger,borderRadius:10,fontSize:12}}>{queueError||error}</div>}{loading?<DataState loading label="worker requests"/>:applications.length===0?<Card style={{marginTop:10}}><div style={{fontWeight:700,color:C.text}}>No demo requests yet</div><div style={{fontSize:12,color:C.textSec,marginTop:5}}>Create a customer demo application to see it here.</div></Card>:applications.map(app=><Card key={app.id} style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",gap:8}}><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{app.serviceName}</div><div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{app.id} · {app.applicantName}</div></div><SBadge status={app.status}/></div><div style={{fontSize:11,color:C.textSec,marginTop:10}}>Allowed demo stages: {stages.join(" → ")}</div>{next[app.status]&&<Btn label={busy===app.id?"Updating…":`Advance to ${next[app.status].replaceAll("_"," ")}`} onClick={()=>update(app)} loading={busy===app.id} full size="md"/>}</Card>)}</div></Phone>;
};

// ── MAIN APP ───────────────────────────────────────────────────────────────
function QuickSevaApp() {
  const [screen, setScreen] = useState("splash");
  const [hist, setHist] = useState([]);
  const [ctx, setCtx] = useState({});
  const [notifs, setNotifs] = useState(NOTIFS_DATA);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const go = (s, data={}) => { setHist(h=>[...h,{screen,ctx}]); setScreen(s); setCtx(data); };
  const back = () => { if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setScreen(p.screen);setCtx(p.ctx);}};
  const nav = (t) => { setHist([]); setScreen(t); setCtx({}); };
  const markOne = (id) => setNotifs(ns=>ns.map(n=>(id==="all"||n.id===id)?{...n,read:true}:n));
  const markAll = () => setNotifs(ns=>ns.map(n=>({...n,read:true})));

  const SCREENS = [
    {id:"splash",label:"Splash",cat:"onboarding"},
    {id:"welcome",label:"Welcome",cat:"onboarding"},
    {id:"login",label:"Login / OTP",cat:"onboarding"},
    {id:"home",label:"Home",cat:"customer"},
    {id:"search",label:"Search",cat:"customer"},
    {id:"catalogue",label:"Catalogue",cat:"customer"},
    {id:"detail",label:"Service Detail",cat:"customer",ctx:{service:SERVICES[0]}},
    {id:"wizard",label:"Apply Wizard",cat:"customer",ctx:{service:SERVICES[0]}},
    {id:"success",label:"Payment Success",cat:"customer",ctx:{service:SERVICES[0]}},
    {id:"tracking",label:"Tracking",cat:"customer",ctx:{application:APPLICATIONS[0]}},
    {id:"applications",label:"My Applications",cat:"customer"},
    {id:"documents",label:"Doc Vault",cat:"customer"},
    {id:"notifications",label:"Notifications",cat:"customer"},
    {id:"support",label:"Support",cat:"customer"},
    {id:"profile",label:"Profile",cat:"customer"},
    {id:"worker",label:"Worker App",cat:"worker"},
  ];

  const CC = {onboarding:"#155EEF",customer:"#0C3DAA",worker:"#E98213"};
  const CL = {onboarding:"Onboarding",customer:"Customer App",worker:"Worker App"};
  const cur = SCREENS.find(s=>s.id===screen)||SCREENS[0];

  const renderScreen = () => {
    switch(screen) {
      case "splash":        return <SplashScreen onNext={()=>go("welcome")}/>;
      case "welcome":       return <WelcomeScreen onNext={()=>go("login")}/>;
      case "login":         return <LoginScreen onNext={()=>go("home")}/>;
      case "home":          return <HomeScreen onNav={(s,d)=>{if(["search","catalogue","notifications","worker"].includes(s))go(s,d||{});else if(s==="detail"&&d)go("detail",{service:d});else if(s==="tracking"&&d)go("tracking",{application:d});else nav(s);}} notifs={notifs}/>;
      case "applications":  return <AppsScreen onAppPress={app=>go("tracking",{application:app})} onNew={()=>go("catalogue")} onNav={nav}/>;
      case "documents":     return <DocsScreen onNav={nav}/>;
      case "support":       return <SupportScreen onNav={nav}/>;
      case "profile":       return <ProfileScreen onNav={s=>{if(s==="notifications")go("notifications");}} onLogout={()=>{setHist([]);setScreen("login");setCtx({});}}/>;
      case "notifications": return <NotifsScreen onBack={back} notifs={notifs} onMark={markOne}/>;
      case "search":        return <SearchScreen onServicePress={svc=>go("detail",{service:svc})} onBack={back}/>;
      case "catalogue":     return <CatalogueScreen onServicePress={svc=>go("detail",{service:svc})} onBack={back}/>;
      case "detail":        return <DetailScreen service={ctx.service||SERVICES[0]} onApply={()=>go("wizard",{service:ctx.service||SERVICES[0]})} onBack={back} onNav={nav}/>;
      case "wizard":        return <WizardScreen service={ctx.service||SERVICES[0]} onSubmit={()=>go("success",{service:ctx.service||SERVICES[0]})} onBack={back}/>;
      case "success":       return <SuccessScreen service={ctx.service||SERVICES[0]} onTrack={()=>go("tracking",{application:APPLICATIONS[0]})} onHome={()=>{setHist([]);setScreen("home");setCtx({});}}/>;
      case "tracking":      return <TrackingScreen application={ctx.application||APPLICATIONS[0]} onBack={back} onNav={nav}/>;
      case "worker":        return <WorkerScreen onBack={back}/>;
      default:              return <HomeScreen onNav={nav} notifs={notifs}/>;
    }
  };

  const ci = SCREENS.findIndex(s=>s.id===screen);

  return (
    <div style={{height:"100vh",background:"#050a18",display:"flex",flexDirection:"column",fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",overflow:"hidden"}}>
      {/* Brand header */}
      <div style={{background:"#0a0f1e",borderBottom:"1px solid #1e293b",padding:"9px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <img src="/quickseva-mark.svg" alt="" style={{width:32,height:32,borderRadius:9}}/>
          <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#fff",fontWeight:800,fontSize:15,lineHeight:1.2}}>QuickSeva</div><div style={{color:"#475569",fontSize:9}}>MVP · Interactive Prototype</div></div>
        </div>
        <div style={{background:`${CC[cur.cat]}22`,border:`1px solid ${CC[cur.cat]}55`,borderRadius:7,padding:"2px 9px"}}>
          <span style={{color:CC[cur.cat],fontSize:10,fontWeight:800}}>{CL[cur.cat]}</span>
        </div>
      </div>

      {/* Screen tabs */}
      <div style={{background:"#0d1525",borderBottom:"1px solid #1e293b",padding:"7px 12px",display:"flex",gap:4,overflowX:"auto",flexShrink:0,scrollbarWidth:"none"}}>
        {SCREENS.map((s,i)=>{const ac=screen===s.id;const cc=CC[s.cat];return <button key={s.id} onClick={()=>{setHist([]);setScreen(s.id);setCtx(s.ctx||{});}} style={{flexShrink:0,padding:"4px 9px",borderRadius:6,border:`1px solid ${ac?cc:"#1e293b"}`,background:ac?`${cc}22`:"transparent",color:ac?cc:"#475569",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>{i+1}. {s.label}</button>;})}
      </div>

      {/* Content: phone + side panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px",gap:18,overflow:"hidden",minHeight:0}}>

        {/* Phone */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#fff",fontWeight:800,fontSize:13,marginBottom:3}}>{cur.label}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:`${CC[cur.cat]}22`,borderRadius:6,padding:"1px 8px"}}>
              <div style={{width:4,height:4,background:CC[cur.cat],borderRadius:"50%"}}/>
              <span style={{color:CC[cur.cat],fontSize:9,fontWeight:700}}>{CL[cur.cat]}</span>
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:46,padding:9,boxShadow:"0 32px 80px rgba(0,0,0,.8),0 0 0 1px #1e293b,inset 0 0 0 1px #374151"}}>
            <div style={{height:5,background:"#0a0f18",borderRadius:"5px 5px 0 0",margin:"0 44px 3px"}}/>
            <div style={{width:375,height:680,borderRadius:34,overflow:"hidden",background:C.bg,position:"relative"}}>
              <div key={screen} style={{width:"100%",height:"100%",animation:"fadeIn .25s ease"}}>
                {renderScreen()}
              </div>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,.18)",borderRadius:2,width:90,margin:"7px auto 0"}}/>
          </div>
          <div style={{color:"#475569",fontSize:10}}>{ci+1} / {SCREENS.length} · {cur.id}</div>
        </div>

        {/* Side panel */}
        <div style={{width:180,flexShrink:0,overflowY:"auto",maxHeight:"100%",scrollbarWidth:"none"}}>
          <div style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:14,padding:12}}>
            <div style={{color:"#64748b",fontSize:9,fontWeight:800,marginBottom:10,textTransform:"uppercase",letterSpacing:.8}}>Quick Jump</div>
            {[{label:"🌅 Onboarding",ids:["splash","welcome","login"]},{label:"🏠 Discovery",ids:["home","search","catalogue"]},{label:"📝 Apply",ids:["detail","wizard","success"]},{label:"📊 Track",ids:["tracking","applications"]},{label:"🗂 Account",ids:["documents","notifications","support","profile"]},{label:"👷 Worker",ids:["worker"]}].map(g=>(
              <div key={g.label} style={{marginBottom:10}}>
                <div style={{color:"#64748b",fontSize:9,fontWeight:700,marginBottom:4}}>{g.label}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {g.ids.map(id=>{const info=SCREENS.find(s=>s.id===id);if(!info)return null;const cc=CC[info.cat];const ac=screen===id;return <button key={id} onClick={()=>{setHist([]);setScreen(id);setCtx(info.ctx||{});}} style={{fontSize:9,padding:"3px 6px",borderRadius:5,border:`1px solid ${ac?cc:"#1e293b"}`,background:ac?`${cc}22`:"transparent",color:ac?cc:"#64748b",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",transition:"all .15s"}}>{info.label}</button>;})}
                </div>
              </div>
            ))}
            <div style={{borderTop:"1px solid #1e293b",paddingTop:10,marginTop:2}}>
              <div style={{color:"#64748b",fontSize:9,fontWeight:800,marginBottom:6,textTransform:"uppercase",letterSpacing:.8}}>Progress</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                {SCREENS.map((s,i)=>{const cc=CC[s.cat];const ac=screen===s.id;const vis=hist.some(h=>h.screen===s.id);return <button key={s.id} onClick={()=>{setHist([]);setScreen(s.id);setCtx(s.ctx||{});}} title={s.label} style={{width:ac?14:6,height:6,borderRadius:3,background:ac?cc:vis?`${cc}88`:"#1e293b",border:"none",cursor:"pointer",transition:"all .25s",padding:0}}/>;})}</div>
              <div style={{color:"#334155",fontSize:9,marginTop:5}}>{ci+1} of {SCREENS.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{background:"#0a0f1e",borderTop:"1px solid #1e293b",padding:"9px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={()=>{if(ci>0){const p=SCREENS[ci-1];setHist([]);setScreen(p.id);setCtx(p.ctx||{});}}} disabled={ci===0} style={{padding:"7px 16px",background:"rgba(255,255,255,.06)",border:"1px solid #1e293b",borderRadius:9,color:"#cbd5e1",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Prev</button>
        <div style={{display:"flex",gap:3}}>
          {SCREENS.map((s,i)=>{const cc=CC[s.cat];const ac=screen===s.id;return <button key={s.id} onClick={()=>{setHist([]);setScreen(s.id);setCtx(s.ctx||{});}} title={s.label} style={{width:ac?20:6,height:6,borderRadius:3,background:ac?cc:hist.some(h=>h.screen===s.id)?`${cc}77`:"#1e293b",border:"none",cursor:"pointer",transition:"all .25s",padding:0}}/>;})}</div>
        <button onClick={()=>{if(ci<SCREENS.length-1){const n=SCREENS[ci+1];setHist([]);setScreen(n.id);setCtx(n.ctx||{});}}} disabled={ci===SCREENS.length-1} style={{padding:"7px 16px",background:C.primary,border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Next →</button>
      </div>
    </div>
  );
}


// ── MOBILE SHELL OVERRIDE ────────────────────────────────────────────────────
// Wrap the app in a shell that adds IDs so CSS can target elements on mobile
const DEMO_TIMELINE_STAGES = [
  ["submitted", "Submitted", "Demo request saved in this browser."],
  ["under_review", "Under Review", "Illustrative sample review step."],
  ["verification", "Verification", "Illustrative step only; no identity verification occurred."],
  ["govt_processing", "Processing", "Sample status only; no government portal is connected."],
  ["dispatched", "Dispatched", "Illustrative dispatch status."],
  ["completed", "Completed", "Demo journey complete; no official document was issued."],
];

function makeDemoTimeline(status, now = new Date()) {
  const current = Math.max(0, DEMO_TIMELINE_STAGES.findIndex(([key]) => key === status));
  return DEMO_TIMELINE_STAGES.map(([key, label, desc], index) => ({
    label,
    desc,
    date: index <= current ? (index === current ? `${now.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · Demo` : "Sample update") : "Expected demo update",
    done: index < current,
    active: index === current,
  }));
}

function MobileApp() {
  const [screen, setScreen] = React.useState("splash");
  const [hist, setHist] = React.useState([]);
  const [ctx, setCtx] = React.useState({});
  const [notifs, setNotifs] = React.useState(NOTIFS_DATA);
  const [services, setServices] = React.useState([]);
  const [applications, setApplications] = React.useState([]);
  const [workerApplications, setWorkerApplications] = React.useState([]);
  const [demoRole, setDemoRole] = React.useState("USER");
  const [authToken, setAuthToken] = React.useState(() => getDemoToken());
  const [apiNotice, setApiNotice] = React.useState("");
  const [localDemoMode, setLocalDemoMode] = React.useState(false);
  const [servicesLoading, setServicesLoading] = React.useState(true);
  const [servicesError, setServicesError] = React.useState("");
  const [applicationsLoading, setApplicationsLoading] = React.useState(false);
  const [applicationsError, setApplicationsError] = React.useState("");
  const [workerLoading, setWorkerLoading] = React.useState(false);
  const [workerError, setWorkerError] = React.useState("");
  const [trackingLoading, setTrackingLoading] = React.useState(false);
  const [trackingError, setTrackingError] = React.useState("");
  const [trackingRefresh, setTrackingRefresh] = React.useState(0);
  const [workerRefresh, setWorkerRefresh] = React.useState(0);

  useEffect(() => {
    let active = true;
    api.services().then((items) => {
      if (!active) return;
      setServices(items.map((item) => ({ ...SERVICES.find((sample) => sample.id === item.id), ...item })));
      setServicesError("");
    }).catch(() => {
      if (!active) return;
      setServices(SERVICES);
      saveDemoToken(null); setAuthToken(null);
      setLocalDemoMode(true);
      setApiNotice("API offline: using browser-local sample mode. Requests stay in this session.");
      setServicesError("");
    }).finally(() => { if (active) setServicesLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (servicesLoading) return;
    if (localDemoMode) return;
    if (!authToken) {
      setApplications([]); setWorkerApplications([]); setDemoRole("USER");
      setApplicationsLoading(false); setWorkerLoading(false);
      return;
    }
    let active = true;
    setApplicationsError(""); setWorkerError("");
    setApplicationsLoading(true); setWorkerLoading(true);
    api.me().then(async (user) => {
      if (!active) return;
      setDemoRole(user.role);
      if (user.role === "WORKER") {
        const queue = await api.workerQueue();
        if (active) { setWorkerApplications(queue); setApplications([]); }
      } else {
        const mine = await api.applications();
        if (active) { setApplications(mine); setWorkerApplications([]); }
      }
    }).catch((error) => {
      if (!active) return;
      setApiNotice(error.message);
      setApplicationsError(error.message); setWorkerError(error.message);
      if (error.status === 401) { saveDemoToken(null); setAuthToken(null); setScreen("login"); }
    }).finally(() => {
      if (active) { setApplicationsLoading(false); setWorkerLoading(false); }
    });
    return () => { active = false; };
  }, [authToken, localDemoMode, servicesLoading, workerRefresh]);

  const refreshApplications = async () => {
    if (localDemoMode) return;
    setApplicationsLoading(true); setApplicationsError("");
    try { const items = await api.applications(); setApplications(items); }
    catch (error) { setApplicationsError(error.message); }
    finally { setApplicationsLoading(false); }
  };

  const refreshWorkerQueue = () => {
    if (localDemoMode) return;
    setWorkerRefresh((n) => n + 1);
  };

  useEffect(() => {
    if (screen !== "applications" || localDemoMode || !authToken || demoRole !== "USER") return;
    refreshApplications();
  }, [screen, authToken, localDemoMode, demoRole]);

  useEffect(() => {
    const id = ctx.application?.id;
    if (screen !== "tracking" || !id || localDemoMode || !authToken || demoRole !== "USER") return;
    let active = true;
    let first = true;
    const refresh = async () => {
      if (first) setTrackingLoading(true);
      setTrackingError("");
      try {
        const current = await api.application(id);
        if (!active) return;
        setCtx((previous) => previous.application?.id === id ? { ...previous, application: current } : previous);
        setApplications((previous) => previous.map((item) => item.id === id ? current : item));
      } catch (error) {
        if (active) setTrackingError(error.message);
      } finally {
        if (active && first) { first = false; setTrackingLoading(false); }
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, [screen, ctx.application?.id, localDemoMode, authToken, demoRole, trackingRefresh]);

  const demoLogin = async (phone, code, role = "USER") => {
    if (localDemoMode) {
      if (code !== "123456") throw new Error("Use the demo code 123456.");
      if (role === "WORKER" && phone !== "5550000001") throw new Error("Use the fictional worker demo account.");
      if (role !== "WORKER" && phone !== "5551234567") throw new Error("Use the fictional customer demo account.");
      setDemoRole(role);
      if (workerApplications.length === 0) setWorkerApplications(APPLICATIONS);
      if (applications.length === 0) setApplications(APPLICATIONS);
      return;
    }
    try {
      const session = await api.demoLogin(phone, code, role);
      saveDemoToken(session.token);
      setAuthToken(session.token);
      setDemoRole(session.user.role);
      setApiNotice(""); setApplicationsError(""); setWorkerError("");
    } catch (error) {
      if (!String(error.message).includes("API is unavailable")) throw error;
      if (code !== "123456") throw new Error("Use the demo code 123456.");
      saveDemoToken(null);
      setAuthToken(null);
      setLocalDemoMode(true);
      setServices(SERVICES);
      setApiNotice("API offline: using browser-local sample mode. Requests stay in this session.");
      setDemoRole(role);
      if (workerApplications.length === 0) setWorkerApplications(APPLICATIONS);
      if (applications.length === 0) setApplications(APPLICATIONS);
    }
  };

  const updateDemoStatus = async (id, status) => {
    if (localDemoMode) {
      const now = new Date();
      const update = (items) => items.map((item) => item.id === id
        ? { ...item, status, tracking: makeDemoTimeline(status, now) }
        : item);
      setWorkerApplications(update);
      setApplications(update);
      setCtx((current) => current.application?.id === id ? { ...current, application: { ...current.application, status, tracking: makeDemoTimeline(status, now) } } : current);
      return;
    }
    setWorkerError(""); setWorkerLoading(true);
    try {
      await api.updateApplicationStatus(id, status);
      const queue = await api.workerQueue();
      setWorkerApplications(queue);
    } catch (error) {
      setWorkerError(error.message);
      throw error;
    } finally { setWorkerLoading(false); }
  };

  const saveApplicationDraft = async (service) => {
    if (localDemoMode) {
      const now = new Date();
      const application = {
        id: `SVO-DEMO-${now.getTime().toString().slice(-7)}`,
        serviceId: service.id,
        serviceName: service.name,
        emoji: service.emoji,
        status: "draft",
        applicantName: "Demo Applicant",
        totalFee: service.govtFee + service.platFee + service.gst,
        createdAt: now.toISOString(),
        submittedAt: null,
        sla: null,
        tracking: [],
      };
      setApplications((previous) => [application, ...previous]);
      go("applications");
      return;
    }
    const application = await api.createApplication({
      serviceId: service.id,
      applicantName: "Demo Applicant",
      formData: { note: "Fictional sample only" },
      submit: false,
    });
    setApplications((previous) => [application, ...previous.filter((item) => item.id !== application.id)]);
    go("applications");
  };

  const submitApplication = async (service) => {
    let application;
    if (localDemoMode) {
      const now = new Date();
      application = {
        id: `SVO-DEMO-${now.getTime().toString().slice(-7)}`,
        serviceId: service.id, serviceName: service.name, emoji: service.emoji,
        status: "submitted", applicantName: "Demo Applicant",
        totalFee: service.govtFee + service.platFee + service.gst,
        createdAt: now.toISOString(), submittedAt: now.toISOString(), sla: null,
        tracking: makeDemoTimeline("submitted", now),
      };
    } else {
      const draft = await api.createApplication({
        serviceId: service.id, applicantName: "Demo Applicant",
        formData: { note: "Fictional sample only" }, submit: false,
      });
      setApplications((previous) => [draft, ...previous.filter((item) => item.id !== draft.id)]);
      application = await api.submitDraft(draft.id);
    }
    setApplications((previous) => [application, ...previous.filter((item) => item.id !== application.id)]);
    if (localDemoMode) setWorkerApplications((previous) => [application, ...previous.filter((item) => item.id !== application.id)]);
    go("success", { service, application });
  };

  const submitExistingDraft = async (draft) => {
    if (localDemoMode) {
      const now = new Date();
      const application = { ...draft, status: "submitted", createdAt: draft.createdAt||now.toISOString(), submittedAt: now.toISOString(), tracking: makeDemoTimeline("submitted", now) };
      setApplications((previous) => previous.map((item) => item.id === draft.id ? application : item));
      go("success", { service: services.find((item) => item.id === draft.serviceId)||SERVICES[0], application });
      return;
    }
    const application = await api.submitDraft(draft.id);
    setApplications((previous) => previous.map((item) => item.id === draft.id ? application : item));
    go("success", { service: services.find((item) => item.id === draft.serviceId)||SERVICES[0], application });
  };

  const logout = () => {
    saveDemoToken(null);
    setAuthToken(null);
    setHist([]);
    setApplications([]); setWorkerApplications([]);
    setApplicationsError(""); setWorkerError("");
    setScreen("login");
    setCtx({});
  };

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const go = (s, data={}) => { setHist(h=>[...h,{screen,ctx}]); setScreen(s); setCtx(data); };
  const back = () => { if(hist.length>0){const p=hist[hist.length-1];setHist(h=>h.slice(0,-1));setScreen(p.screen);setCtx(p.ctx);}};
  const nav = (t) => { setHist([]); setScreen(t); setCtx({}); };
  const markOne = (id) => setNotifs(ns=>ns.map(n=>(id==="all"||n.id===id)?{...n,read:true}:n));

  const SCREENS = [
    {id:"splash",label:"Splash",cat:"onboarding"},
    {id:"welcome",label:"Welcome",cat:"onboarding"},
    {id:"login",label:"Login / OTP",cat:"onboarding"},
    {id:"home",label:"Home",cat:"customer"},
    {id:"search",label:"Search",cat:"customer"},
    {id:"catalogue",label:"Catalogue",cat:"customer"},
    {id:"detail",label:"Service Detail",cat:"customer",ctx:{service:services[0]}},
    {id:"wizard",label:"Apply Wizard",cat:"customer",ctx:{service:services[0]}},
    {id:"success",label:"Request Submitted",cat:"customer",ctx:{service:services[0]}},
    {id:"tracking",label:"Tracking",cat:"customer",ctx:{application:applications[0]||(localDemoMode?APPLICATIONS[0]:null)}},
    {id:"applications",label:"My Applications",cat:"customer"},
    {id:"documents",label:"Doc Vault",cat:"customer"},
    {id:"notifications",label:"Notifications",cat:"customer"},
    {id:"support",label:"Support",cat:"customer"},
    {id:"profile",label:"Profile",cat:"customer"},
    {id:"worker",label:"Worker App",cat:"worker"},
  ];

  const CC = {onboarding:"#155EEF",customer:"#0C3DAA",worker:"#E98213"};
  const CL = {onboarding:"Onboarding",customer:"Customer App",worker:"Worker App"};
  const cur = SCREENS.find(s=>s.id===screen)||SCREENS[0];
  const ci  = SCREENS.findIndex(s=>s.id===screen);

  const renderScreen = () => {
    switch(screen) {
      case "splash":        return <SplashScreen onNext={()=>go("welcome")}/>;
      case "welcome":       return <WelcomeScreen onNext={()=>go("login")}/>;
      case "login":         return <LoginScreen onLogin={demoLogin} onNext={(role)=>go(role==="WORKER"?"worker":"home")}/>;
      case "home":          return <HomeScreen services={services} applications={applications} applicationsLoading={applicationsLoading} applicationsError={applicationsError} onRetryApplications={refreshApplications} onNav={(s,d)=>{if(["search","catalogue","notifications","worker"].includes(s))go(s,d||{});else if(s==="detail"&&d)go("detail",{service:d});else if(s==="tracking"&&d)go("tracking",{application:d});else nav(s);}} notifs={notifs}/>;
      case "applications":  return <AppsScreen applications={applications} loading={applicationsLoading} error={applicationsError} onRetry={refreshApplications} onSubmitDraft={submitExistingDraft} onAppPress={app=>go("tracking",{application:app})} onNew={()=>go("catalogue")} onNav={nav}/>;
      case "documents":     return <DocsScreen onNav={nav}/>;
      case "support":       return <SupportScreen onNav={nav}/>;
      case "profile":       return <ProfileScreen onNav={s=>{if(s==="notifications")go("notifications");}} onLogout={logout}/>;
      case "notifications": return <NotifsScreen onBack={back} notifs={notifs} onMark={markOne}/>;
      case "search":        return <SearchScreen services={services} onServicePress={svc=>go("detail",{service:svc})} onBack={back}/>;
      case "catalogue":     return <CatalogueScreen services={services} loading={servicesLoading} error={servicesError} onRetry={()=>{setServicesLoading(true);api.services().then(items=>{setServices(items.map(item=>({...SERVICES.find(sample=>sample.id===item.id),...item})));setServicesError("");setLocalDemoMode(false);}).catch(error=>setServicesError(error.message)).finally(()=>setServicesLoading(false));}} onServicePress={svc=>go("detail",{service:svc})} onBack={back}/>;
      case "detail":        return <DetailScreen service={ctx.service||services[0]||SERVICES[0]} onApply={()=>go("wizard",{service:ctx.service||services[0]||SERVICES[0]})} onBack={back} onNav={nav}/>;
      case "wizard":        return <WizardScreen service={ctx.service||services[0]||SERVICES[0]} onSubmit={()=>submitApplication(ctx.service||services[0]||SERVICES[0])} onSaveDraft={()=>saveApplicationDraft(ctx.service||services[0]||SERVICES[0])} onBack={back}/>;
      case "success":       return <SuccessScreen service={ctx.service||services[0]} application={ctx.application} onTrack={()=>go("tracking",{application:ctx.application||applications[0]})} onHome={()=>{setHist([]);setScreen("home");setCtx({})}}/>;
      case "tracking":      return <TrackingScreen application={ctx.application||applications[0]||(localDemoMode?APPLICATIONS[0]:null)} loading={trackingLoading} error={trackingError} onRetry={()=>{setTrackingRefresh((n)=>n+1);}} onBack={back} onNav={nav}/>;
      case "worker":        return demoRole==="WORKER"?<DemoWorkerScreen applications={workerApplications} loading={workerLoading} queueError={workerError} onRefresh={refreshWorkerQueue} onUpdate={updateDemoStatus} onBack={back}/>:<LoginScreen onLogin={demoLogin} onNext={(role)=>go(role==="WORKER"?"worker":"home")}/>;
      default:              return <HomeScreen services={services} applications={applications} applicationsLoading={applicationsLoading} applicationsError={applicationsError} onRetryApplications={refreshApplications} onNav={nav} notifs={notifs}/>;
    }
  };

  const isMobile = window.innerWidth <= 700;

  if (isMobile) {
    // Mobile: pure full-screen app, no chrome
    return (
      <div id="phone-wrap" style={{width:"100vw",height:"100vh",overflow:"hidden",background:C.bg,position:"relative"}}>
        {localDemoMode&&<span role="status" aria-label="API offline. The app is using browser-local sample data for this session." title="API offline · using browser-local sample data" style={{position:"absolute",zIndex:50,top:12,left:12,width:10,height:10,borderRadius:"50%",background:"#dc2626",border:"2px solid #fff",boxShadow:"0 1px 5px rgba(15,23,42,.3)"}}/>}
        <div id="phone-screen" style={{width:"100%",height:"100%",overflow:"hidden"}}>
          <div key={screen} style={{width:"100%",height:"100%"}}>
            {renderScreen()}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: full prototype shell with nav controls
  return (
    <div id="desktop-shell" style={{height:"100vh",background:"#050a18",display:"flex",flexDirection:"column",fontFamily:"Inter,ui-sans-serif,system-ui,-apple-system,sans-serif",overflow:"hidden"}}>
      <div id="shell-top" style={{background:"#0a0f1e",borderBottom:"1px solid #1e293b",padding:"9px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <img src="/quickseva-mark.svg" alt="" style={{width:32,height:32,borderRadius:9}}/>
          <div><div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#fff",fontWeight:800,fontSize:15}}>QuickSeva</div><div style={{color:"#475569",fontSize:9}}>MVP · Interactive Prototype</div></div>
        </div>
        <div style={{background:`${CC[cur.cat]}22`,border:`1px solid ${CC[cur.cat]}55`,borderRadius:7,padding:"2px 9px"}}>
          <span style={{color:CC[cur.cat],fontSize:10,fontWeight:800}}>{CL[cur.cat]}</span>
        </div>
      </div>
      <div id="shell-tabs" style={{background:"#0d1525",borderBottom:"1px solid #1e293b",padding:"7px 12px",display:"flex",gap:4,overflowX:"auto",flexShrink:0,scrollbarWidth:"none"}}>
        {SCREENS.map((s,i)=>{const ac=screen===s.id;const cc=CC[s.cat];return <button key={s.id} onClick={()=>{setHist([]);setScreen(s.id);setCtx(s.ctx||{});}} style={{flexShrink:0,padding:"4px 9px",borderRadius:6,border:`1px solid ${ac?cc:"#1e293b"}`,background:ac?`${cc}22`:"transparent",color:ac?cc:"#475569",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{i+1}. {s.label}</button>;})}
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px",gap:18,overflow:"hidden",minHeight:0}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#fff",fontWeight:800,fontSize:13,textAlign:"center",marginBottom:4}}>{cur.label}</div>
          <div id="phone-bezel" style={{background:"#111827",borderRadius:46,padding:9,boxShadow:"0 32px 80px rgba(0,0,0,.8),0 0 0 1px #1e293b"}}>
            <div style={{height:5,background:"#0a0f18",borderRadius:"5px 5px 0 0",margin:"0 44px 3px"}}/>
            <div id="phone-screen" style={{width:375,height:680,borderRadius:34,overflow:"hidden",background:C.bg,position:"relative"}}>
              <div key={screen} style={{width:"100%",height:"100%",animation:"fadeIn .25s ease"}}>{renderScreen()}</div>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,.18)",borderRadius:2,width:90,margin:"7px auto 0"}}/>
          </div>
          <div style={{color:"#475569",fontSize:10}}>{ci+1} / {SCREENS.length}</div>
        </div>
        <div id="side-panel" style={{width:175,flexShrink:0,overflowY:"auto",maxHeight:"100%",scrollbarWidth:"none"}}>
          <div id="side-panel-card" style={{background:"#0a0f1e",border:"1px solid #1e293b",borderRadius:14,padding:12}}>
            <div style={{color:"#64748b",fontSize:9,fontWeight:800,marginBottom:10,textTransform:"uppercase",letterSpacing:.8}}>Quick Jump</div>
            {[{label:"🌅 Onboarding",ids:["splash","welcome","login"]},{label:"🏠 Discovery",ids:["home","search","catalogue"]},{label:"📝 Apply",ids:["detail","wizard","success"]},{label:"📊 Track",ids:["tracking","applications"]},{label:"🗂 Account",ids:["documents","notifications","support","profile"]},{label:"👷 Worker",ids:["worker"]}].map(g=>(
              <div key={g.label} style={{marginBottom:10}}>
                <div style={{color:"#64748b",fontSize:9,fontWeight:700,marginBottom:4}}>{g.label}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {g.ids.map(id=>{const info=SCREENS.find(s=>s.id===id);if(!info)return null;const cc=CC[info.cat];const ac=screen===id;return <button key={id} onClick={()=>{setHist([]);setScreen(id);setCtx(info.ctx||{});}} style={{fontSize:9,padding:"3px 6px",borderRadius:5,border:`1px solid ${ac?cc:"#1e293b"}`,background:ac?`${cc}22`:"transparent",color:ac?cc:"#64748b",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>{info.label}</button>;})}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="shell-bottom" style={{background:"#0a0f1e",borderTop:"1px solid #1e293b",padding:"9px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <button onClick={()=>{if(ci>0){const p=SCREENS[ci-1];setHist([]);setScreen(p.id);setCtx(p.ctx||{});}}} disabled={ci===0} style={{padding:"7px 16px",background:"rgba(255,255,255,.06)",border:"1px solid #1e293b",borderRadius:9,color:"#cbd5e1",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Prev</button>
        <div style={{display:"flex",gap:3}}>
          {SCREENS.map((s,i)=>{const cc=CC[s.cat];const ac=screen===s.id;return <button key={s.id} onClick={()=>{setHist([]);setScreen(s.id);setCtx(s.ctx||{});}} title={s.label} style={{width:ac?20:6,height:6,borderRadius:3,background:ac?cc:"#1e293b",border:"none",cursor:"pointer",padding:0}}/>;})}</div>
        <button onClick={()=>{if(ci<SCREENS.length-1){const n=SCREENS[ci+1];setHist([]);setScreen(n.id);setCtx(n.ctx||{});}}} style={{padding:"7px 16px",background:C.primary,border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Next →</button>
      </div>
    </div>
  );
}

class StartupBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error("QuickSeva startup error:", error); }
  render() {
    if (!this.state.error) return this.props.children;
    return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:C.bg,color:C.text,fontFamily:"Inter,system-ui,sans-serif"}}><div style={{maxWidth:380,padding:24,background:C.white,border:`1px solid ${C.border}`,borderRadius:18,boxShadow:"0 12px 34px rgba(26,47,87,.08)"}}><div style={{fontSize:30,marginBottom:8}}>⚠️</div><h1 style={{fontSize:20,marginBottom:8}}>QuickSeva could not start</h1><p style={{fontSize:13,color:C.textSec,lineHeight:1.55,overflowWrap:"anywhere"}}>{String(this.state.error.message||this.state.error)}</p><button onClick={()=>location.reload()} style={{marginTop:18,border:0,borderRadius:12,padding:"12px 18px",background:C.primary,color:C.white,fontWeight:700,cursor:"pointer"}}>Reload</button></div></div>;
  }
}

export default MobileApp;
