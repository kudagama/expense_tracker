import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWallets} from '../src/lib/walletAccounting.js';
import {financialInsights} from '../src/lib/financialInsights.js';
test('automatic transfers conserve net assets',()=>{const {balances}=calculateWallets({salary:1000,incomes:[{amount:100}],savings:[{amount:200}],expenses:[{wallet:'cash',amount:50}]},{mode:'automatic',opening:{},transfers:[{from:'bank',to:'cash',amount:100}]});assert.deepEqual(balances,{cash:50,bank:800,savings:200,credit:0});});
test('manual mode does not add salary again',()=>{assert.equal(calculateWallets({salary:1000},{opening:{bank:1000},transfers:[]}).balances.bank,1000);});
test('credit purchase and repayment',()=>{const {balances}=calculateWallets({expenses:[{wallet:'credit',amount:100}]},{opening:{bank:500},transfers:[{from:'bank',to:'credit',amount:40}]});assert.equal(balances.credit,60);assert.equal(balances.bank,460);});
test('salary cycle forecast',()=>{const a=financialInsights({salary:1000,expenses:[{amount:100}]},null,'2026-11',new Date('2026-11-24T06:00:00Z'));assert.equal(a.elapsed,2);assert.equal(a.left,28);assert.equal(a.forecast,-500);});
