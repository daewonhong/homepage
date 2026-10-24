'use strict';
// 공개할 연락처만 입력하세요. 비밀 키나 비밀번호를 넣지 마세요.
const SITE_CONFIG = {
  email: '',
  phone: '',
  inquiryFormUrl: '',
  podcastUrl: '',
  blogUrl: ''
};
const $ = (s) => document.querySelector(s);
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#nav').classList.toggle('open',open);});
$('#nav').addEventListener('click', e => {if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');$('#nav').classList.remove('open');}});
const audienceData={
 welfare:['사회복지시설의 일에 맞게','상담 기록 정리, 사업계획서, 프로그램 기획을 가상 자료로 연습합니다.','실제 이용자의 개인정보 대신 가상 사례를 사용하고, 작성한 내용은 담당자가 검토합니다.'],
 community:['주민의 일상과 배움을 잇도록','생활 속 AI 활용, 주민 대상 디지털 교육, 함께 만드는 창작 프로그램을 구성합니다.','주민의 디지털 숙련도와 사용 기기를 확인하고, 생활에 가까운 사례부터 시작합니다.'],
 senior:['내 속도로 배우고, 내 이야기를 남기도록','쉬운 AI 입문부터 인생 이야기 정리, 자서전·에세이 만들기까지 차근차근 함께합니다.','쉬운 표현, 단계별 실습과 반복 연습을 중심으로 진행합니다. 가족의 개인정보도 신중하게 다룹니다.'],
 education:['배움의 과정을 더 풍부하게','수업 기획, 학습 자료 제작과 프로젝트 기반 창작 활동에 AI를 연결합니다.','학습자 정보와 저작권을 고려하고, 생성된 자료의 정확성을 검토합니다.'],
 business:['반복 업무에서 우리 가게의 콘텐츠까지','반복 문서, 상품 소개, 홍보 콘텐츠와 고객 응대 문구를 직접 만들어 봅니다.','고객 개인정보와 영업정보를 보호하고, 상품 설명과 홍보 문구의 사실 여부를 확인합니다.']
};
document.querySelectorAll('[data-audience]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-audience]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const [title,copy,note]=audienceData[b.dataset.audience];$('#aud-title').textContent=title;$('#aud-copy').textContent=copy;$('#aud-note').textContent=note;}));
document.querySelectorAll('[data-program]').forEach(a=>a.addEventListener('click',()=>{$('#program-select').value=a.dataset.program;}));
const dialog=$('#image-dialog');let opener=null;
function openImage(button){opener=button;const source=button.dataset.image||button.dataset.open;const original=[...document.querySelectorAll('[data-image]')].find(x=>x.dataset.image===source);$('#dialog-image').src=source;$('#dialog-image').alt=original.dataset.alt;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-scroll').scrollTo(0,0);}
document.querySelectorAll('[data-image],[data-open]').forEach(b=>b.addEventListener('click',()=>openImage(b)));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
const safeUrl=(value)=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}};
const configuredEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.email)?SITE_CONFIG.email:'';
const formUrl=safeUrl(SITE_CONFIG.inquiryFormUrl);
function contactLink(label,href,external=false){const a=document.createElement('a');a.className='contact-link';a.textContent=label;a.href=href;if(external){a.target='_blank';a.rel='noopener noreferrer';}$('#contact-links').append(a);}
if(configuredEmail)contactLink(configuredEmail,'mailto:'+configuredEmail);
if(/^[+\d\s()-]{7,25}$/.test(SITE_CONFIG.phone))contactLink(SITE_CONFIG.phone,'tel:'+SITE_CONFIG.phone.replace(/[^+\d]/g,''));
if(safeUrl(SITE_CONFIG.podcastUrl))contactLink('팟캐스트 바로가기 ↗',safeUrl(SITE_CONFIG.podcastUrl),true);
if(safeUrl(SITE_CONFIG.blogUrl))contactLink('블로그·SNS 바로가기 ↗',safeUrl(SITE_CONFIG.blogUrl),true);
if(configuredEmail||formUrl){$('#connection-title').textContent='문의 내용을 정리해 전달해 주세요';$('#connection-copy').textContent='작성 후 이메일 앱이나 외부 문의 폼을 열어 전달할 수 있습니다. 이 사이트에서 직접 전송되지는 않습니다.';}
$('#inquiry-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const c=f.elements.contact;c.setCustomValidity('');const contact=c.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)&&!/^\+?[\d\s()-]{8,25}$/.test(contact)){c.setCustomValidity('올바른 이메일 또는 전화번호를 입력해 주세요.');c.reportValidity();return;}if(!f.reportValidity())return;const d=new FormData(f);const text=['[홍대원 강사 교육 문의]','이름: '+d.get('name').trim(),'기관명: '+(d.get('organization').trim()||'미입력'),'연락처: '+contact,'관심 프로그램: '+d.get('program'),'교육 대상과 인원: '+(d.get('audience').trim()||'협의 희망'),'희망 일정과 방식: '+(d.get('schedule').trim()||'협의 희망'),'문의 내용: '+(d.get('message').trim()||'상담 희망')].join('\n');$('#result-text').value=text;$('#inquiry-result').hidden=false;$('#form-status').textContent='문의 내용을 정리했습니다. 아직 전송되지 않았습니다.';if(configuredEmail){$('#email-link').hidden=false;$('#email-link').href='mailto:'+configuredEmail+'?subject='+encodeURIComponent('[강의 문의] '+d.get('program'))+'&body='+encodeURIComponent(text);}if(formUrl){$('#external-link').hidden=false;$('#external-link').href=formUrl;}$('#result-text').focus();});
$('#inquiry-form').elements.contact.addEventListener('input',e=>e.target.setCustomValidity(''));
$('#copy-inquiry').addEventListener('click',async()=>{try{if(!navigator.clipboard)throw new Error('clipboard unavailable');await navigator.clipboard.writeText($('#result-text').value);$('#form-status').textContent='내용을 복사했습니다. 사용할 이메일이나 문의 창에 붙여 넣어 주세요. 아직 전송되지 않았습니다.';}catch{$('#result-text').focus();$('#result-text').select();$('#form-status').textContent='자동 복사를 사용할 수 없습니다. 선택된 내용을 직접 복사해 주세요. 아직 전송되지 않았습니다.'}});
