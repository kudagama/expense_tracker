export const walletKeys=['cash','bank','savings','credit'];
export function calculateWallets(data,plan){
 const balances=Object.fromEntries(walletKeys.map(k=>[k,Math.round(Number(plan.opening?.[k]||0)*100)]));
 const cents=n=>Math.round(Number(n||0)*100);
 let unassigned=0;
 if(plan.mode==='automatic'){
  balances[plan.salaryWallet==='cash'?'cash':'bank']+=cents(data?.salary);
  for(const e of data?.incomes||[])balances.bank+=cents(e.amount);
  for(const e of data?.savings||[]){balances.bank-=cents(e.amount);balances.savings+=cents(e.amount);}
 }
 for(const e of data?.expenses||[]){if(!walletKeys.includes(e.wallet)){unassigned+=cents(e.amount);continue;}balances[e.wallet]+=cents(e.amount)*(e.wallet==='credit'?1:-1);}
 for(const t of plan.transfers||[]){if(!walletKeys.includes(t.from)||!walletKeys.includes(t.to)||t.from==='credit')continue;balances[t.from]-=cents(t.amount);balances[t.to]+=cents(t.amount)*(t.to==='credit'?-1:1);}
 return {balances:Object.fromEntries(walletKeys.map(k=>[k,balances[k]/100])),unassigned:unassigned/100};
}
