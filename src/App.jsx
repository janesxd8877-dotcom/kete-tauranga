import { useState, useCallback } from "react";

// ========== STYLES ==========
const C = { bg:'#0a1a14', sf:'rgba(255,255,255,0.03)', sb:'rgba(255,255,255,0.07)', ac:'#10b981', ad:'rgba(16,185,129,0.15)', ab:'rgba(16,185,129,0.25)', t1:'#ecfdf5', t2:'#a7f3d0', t3:'#6ee7b7', yl:'#fbbf24', yld:'rgba(234,179,8,0.08)', ylb:'rgba(234,179,8,0.2)' };

// ========== STORE REGISTRY (single source of truth) ==========
// Each store has a unique `key` used across all features
const ALL_STORES = [
  // ---- Pak'nSave ----
  { key:'pns-cameron', name:"Pak'nSave Cameron Rd", chain:"Pak'nSave", area:'Central Tauranga', address:'476 Cameron Road, Tauranga 3110', hours:'8am-9pm, 7 days', type:'Budget Supermarket', tip:"Cheapest overall. Go early morning or after 6:30pm. Fuel station on-site. Club+ from June 2026.", color:'#eab308', lat:-37.6931, lng:176.1654 },
  { key:'pns-tauriko', name:"Pak'nSave Tauriko", chain:"Pak'nSave", area:'Tauriko / West', address:'2 Taurikura Drive, Tauriko (Tauranga Crossing)', hours:'7am-9pm, 7 days', type:'Budget Supermarket', tip:"Newer, less crowded. The Warehouse & Noel Leeming next door. Good car park.", color:'#eab308', lat:-37.7412, lng:176.0847 },
  // ---- New World ----
  { key:'nw-gatepa', name:'New World Gate Pa', chain:'New World', area:'Central Tauranga', address:'948 Cameron Road, Gate Pa, Tauranga 3112', hours:'7am-9pm, 7 days', type:'Premium Supermarket', tip:"Best bakery and deli. Only buy specials or Club+ deals — shelf prices are higher.", color:'#ef4444', lat:-37.7138, lng:176.1427 },
  { key:'nw-brookfield', name:'New World Brookfield', chain:'New World', area:'North Tauranga', address:'89 Bellevue Road, Brookfield, Tauranga', hours:'7am-9pm, 7 days', type:'Premium Supermarket', tip:"Quieter than Gate Pa. Good produce section. Worth checking weekly club specials.", color:'#ef4444', lat:-37.6732, lng:176.1412 },
  { key:'nw-mount', name:'New World Mt Maunganui', chain:'New World', area:'Mt Maunganui', address:'Cnr Tweed St & Maunganui Rd, Mt Maunganui 3116', hours:'7am-9pm, 7 days', type:'Premium Supermarket', tip:"Convenient for Mount residents. Smaller store — better for top-up shops.", color:'#ef4444', lat:-37.6378, lng:176.1812 },
  // ---- Woolworths ----
  { key:'ww-tauranga', name:'Woolworths Tauranga', chain:'Woolworths', area:'Central Tauranga', address:'618 Cameron Road, Tauranga 3112', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Central CBD location. Everyday Rewards points. Good for city workers doing a quick shop. Check weekly half-price deals.", color:'#22c55e', lat:-37.6872, lng:176.1654 },
  { key:'ww-frasercove', name:'Woolworths Fraser Cove', chain:'Woolworths', area:'South Tauranga', address:'Fraser Cove Shopping Centre, Tauranga', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Serves Greerton and Merivale. Everyday Rewards points. Good car parking. Check weekly half-price deals.", color:'#22c55e', lat:-37.7001, lng:176.1423 },
  { key:'ww-buretapark', name:'Woolworths Bureta Park', chain:'Woolworths', area:'North Tauranga', address:'Bureta Park Shopping Centre, Bureta Road, Otumoetai', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Handy for Otumoetai and Bureta residents. Everyday Rewards points. Check weekly half-price deals.", color:'#22c55e', lat:-37.6798, lng:176.1356 },
  { key:'ww-bethlehem', name:'Woolworths Bethlehem', chain:'Woolworths', area:'Bethlehem / North', address:'19 Bethlehem Road, Bethlehem, Tauranga', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Everyday Rewards points. Longer hours than most. Check weekly half-price deals.", color:'#22c55e', lat:-37.6598, lng:176.1213 },
  { key:'ww-bayfair', name:'Woolworths Bayfair', chain:'Woolworths', area:'Mt Maunganui', address:'1-19 Girven Road, Mt Maunganui (Bayfair Mall)', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Large format inside Bayfair. Good for weekly shop if you're in the Mount.", color:'#22c55e', lat:-37.6748, lng:176.2231 },
  { key:'ww-papamoa', name:'Woolworths Papamoa', chain:'Woolworths', area:'Papamoa', address:'7 Gravatt Road, Papamoa', hours:'7am-10pm, 7 days', type:'Mid-range Supermarket', tip:"Convenient for Papamoa residents. Check Everyday Rewards for personalised half-price deals.", color:'#22c55e', lat:-37.7115, lng:176.2821 },
  // ---- FreshChoice ----
  { key:'fc-greerton', name:'FreshChoice Greerton', chain:'FreshChoice', area:'South Tauranga', address:'1368 Cameron Road, Gate Pa, Tauranga', hours:'8am-9pm, 7 days', type:'Mid-range Supermarket', tip:"Opened November 2024. Locally owned. Good fresh produce and meat.", color:'#06b6d4', lat:-37.7268, lng:176.1448 },
  { key:'fc-pyespa', name:'FreshChoice Pyes Pa', chain:'FreshChoice', area:'Pyes Pa / Lakes', address:'83 Pyes Pa Road, Pyes Pa, Tauranga', hours:'7am-9pm, 7 days', type:'Mid-range Supermarket', tip:"Handy for Pyes Pa and Lakes. Locally owned — staff know their regulars.", color:'#06b6d4', lat:-37.7428, lng:176.1232 },
  { key:'fc-papamoa', name:'FreshChoice Papamoa Beach', chain:'FreshChoice', area:'Papamoa', address:'20 Coast Boulevard, Papamoa Beach', hours:'7am-9pm, 7 days', type:'Mid-range Supermarket', tip:"Beachside location. Great for Papamoa Beach residents. Fresh local produce.", color:'#06b6d4', lat:-37.7021, lng:176.3142 },
  // ---- Four Square ----
  { key:'fs-welcomebay', name:'Four Square Welcome Bay', chain:'Four Square', area:'Welcome Bay / South', address:'248 Welcome Bay Road, Welcome Bay, Tauranga 3112', hours:'7am-8pm, 7 days', type:'Convenience', tip:"Locally owned. Alcohol and Lotto available. Great for top-up shops.", color:'#f97316', lat:-37.7389, lng:176.2156 },
  { key:'fs-ohauiti', name:'Four Square Ohauiti', chain:'Four Square', area:'South Tauranga', address:'154 Ohauiti Road, Hairini, Tauranga 3112', hours:'7am-7:30pm, 7 days', type:'Convenience', tip:"Serves Hairini/Ohauiti. Handy for locals avoiding the Cameron Rd trek.", color:'#f97316', lat:-37.7489, lng:176.1512 },
  { key:'fs-mount', name:'Four Square Mt Maunganui', chain:'Four Square', area:'Mt Maunganui', address:'217 Maunganui Road, Mt Maunganui 3116', hours:'7am-8pm, 7 days', type:'Convenience', tip:"Central Mount location. Great for quick shops between beach and home.", color:'#f97316', lat:-37.6312, lng:176.1934 },
  { key:'fs-cherrywood', name:'Four Square Cherrywood', chain:'Four Square', area:'North Tauranga', address:'56 Cherrywood Drive, Otumoetai, Tauranga 3110', hours:'7:30am-8pm, 7 days', type:'Convenience', tip:"Otumoetai neighbourhood store. Good fresh bread daily.", color:'#f97316', lat:-37.6821, lng:176.1398 },
  { key:'fs-lakes', name:'Four Square The Lakes', chain:'Four Square', area:'Pyes Pa / Lakes', address:'9/1 Caslani Lane, Pyes Pa, Tauranga 3112', hours:'7am-8pm, 7 days', type:'Convenience', tip:"Serves The Lakes and Pyes Pa West. Stock up to avoid the drive.", color:'#f97316', lat:-37.7512, lng:176.1178 },
  { key:'fs-tepuna', name:'Four Square Te Puna', chain:'Four Square', area:'Tauriko / West', address:'626 State Highway 2, Te Puna, Tauranga 3176', hours:'7am-8pm, 7 days', type:'Convenience', tip:"Serves Te Puna rural area. Good community store.", color:'#f97316', lat:-37.6312, lng:176.0534 },
  { key:'fs-papamoa', name:'Four Square Papamoa', chain:'Four Square', area:'Papamoa', address:'4 Golden Sands Drive, Papamoa, Tauranga 3118', hours:'7am-8pm, 7 days', type:'Convenience', tip:"Eastern Papamoa store. Handy for Golden Sands and surrounding suburbs.", color:'#f97316', lat:-37.7198, lng:176.3012 },
  // ---- Local ----
  // valueTags: { label, level } where level = 'cheaper' (green) | 'worth' (yellow)
  { key:'bininn-bethlehem', name:'Bin Inn Bethlehem', chain:'Bin Inn', area:'Bethlehem / North', address:'Shop H7, Bethlehem Shopping Centre', hours:'Mon-Sat 9am-5:30pm', type:'Bulk Store', tip:"Nuts at half supermarket price. 5% off BYO container. Peanut & almond butter machines.", color:'#a78bfa', lat:-37.6601, lng:176.1228,
    valueTags:[{label:'🥜 Nuts & seeds',level:'cheaper'},{label:'🌾 Grains & flour',level:'cheaper'},{label:'🫙 Dried fruit',level:'cheaper'}] },
  { key:'bininn-papamoa', name:'Bin Inn Papamoa', chain:'Bin Inn', area:'Papamoa', address:'30F Gravatt Rd, Fashion Island, Papamoa', hours:'Mon-Sat 9am-5:30pm', type:'Bulk Store', tip:"Biggest bulk range in region. BYO container for 5% off.", color:'#a78bfa', lat:-37.7115, lng:176.2821,
    valueTags:[{label:'🥜 Nuts & seeds',level:'cheaper'},{label:'🌾 Grains & flour',level:'cheaper'},{label:'🫙 Dried fruit',level:'cheaper'}] },
  { key:'frenchsfarm', name:"French's Farm", chain:'Local', area:'Welcome Bay / South', address:'87 Kaituna River Road', hours:'9am-7pm, 7 days', type:'Farm Gate', tip:"Farm gate stall ~15min from CBD. Whiteboard prices, very competitive. Full veg range.", color:'#84cc16', lat:-37.8012, lng:176.2234,
    valueTags:[{label:'🥦 Seasonal veg',level:'cheaper'},{label:'🥕 Root veg',level:'cheaper'},{label:'🥬 Leafy greens',level:'cheaper'},{label:'🎃 Pumpkin & squash',level:'cheaper'}] },
  { key:'goodfarm', name:'The Good Farm', chain:'Local', area:'Welcome Bay / South', address:'512 Welcome Bay Road', hours:'7am-7pm, self-service', type:'Farm Shop', tip:"Raw milk $4.50/L, free-range eggs $12/doz. Cash/bank transfer only. BYO bottles.", color:'#84cc16', lat:-37.7389, lng:176.2156,
    valueTags:[{label:'🥛 Raw milk',level:'worth'},{label:'🥚 Free-range eggs',level:'worth'},{label:'🍯 Local honey',level:'worth'}] },
  { key:'kiwifresh', name:'Kiwi Fresh Meats', chain:'Local', area:'Tauriko / West', address:'8 Taurikura Drive, Tauriko', hours:'Mon-Fri 7am-5:30pm, Sat 7am-4pm, Sun 7am-3pm', type:'Butcher', tip:"Full online price list at kiwifreshmeats.co.nz/shop. Weekly in-store specials.", color:'#e879f9', lat:-37.7408, lng:176.0851,
    valueTags:[{label:'🥩 Bulk meat',level:'cheaper'},{label:'🐑 Lamb cuts',level:'cheaper'},{label:'🐖 Pork ribs',level:'worth'}] },
  { key:'bethbutchery', name:'Bethlehem Butchery', chain:'Local', area:'Bethlehem / North', address:'State Highway 2, Bethlehem', hours:'Mon-Fri 7:30am-5:30pm, Sat 7am-1pm', type:'Butcher', tip:"Family-run since 2002. Free-range, preservative-free. Gluten-free & Paleo options.", color:'#e879f9', lat:-37.6588, lng:176.1198,
    valueTags:[{label:'🥩 Free-range meat',level:'worth'},{label:'🌿 Preservative-free',level:'worth'}] },
  { key:'eljefe', name:'El Jefe Meats', chain:'Local', area:'Mt Maunganui', address:'Unit 3, 60 Aviation Ave, Mt Maunganui', hours:'Mon-Fri 9am-3pm, Sat 9am-2pm', type:'Artisan Butcher', tip:"Uruguayan chef. Gourmet sausages, smoked bacon, salami. SPCA certified.", color:'#e879f9', lat:-37.6421, lng:176.1889,
    valueTags:[{label:'🌭 Gourmet sausages',level:'worth'},{label:'🥓 Smoked bacon',level:'worth'}] },
  // ---- From Tauranga Local Stores spreadsheet ----
  { key:'asian101', name:'101 Asian Supermarket', chain:'Local', area:'Central Tauranga', address:'683 Cameron Road, Tauranga', hours:'9am-6pm daily', type:'Asian Grocery', tip:"Local Asian supermarket. Rice, sauces, spices, noodles. Address to be verified — call ahead.", color:'#f97316', lat:-37.6878, lng:176.1651,
    valueTags:[{label:'🍚 Rice',level:'cheaper'},{label:'🥢 Noodles & sauces',level:'cheaper'},{label:'🫙 Asian pantry',level:'cheaper'}] },
  { key:'dh-tauranga', name:'DH Tauranga', chain:'Local', area:'Central Tauranga', address:'Cameron Road area', hours:'8:30am-8:30pm daily', type:'Indian Grocery', tip:"Farm-fresh fruit & veg at unbeatable prices. Indian spices, snacks, frozen foods much cheaper than supermarket.", color:'#f97316', website:'facebook.com/DH-Tauranga', lat:-37.6950, lng:176.1620,
    valueTags:[{label:'🥬 Fresh veg',level:'cheaper'},{label:'🌶️ Indian spices',level:'cheaper'},{label:'🧊 Frozen foods',level:'cheaper'}] },
  { key:'vetro', name:'Vetro Tauranga', chain:'Local', area:'Central Tauranga', address:'Third Avenue, Tauranga', hours:'Mon-Fri 9am-5pm, Sat 9am-4pm', type:'Specialty Deli', tip:"Mediterranean foods, quality olive oils, nuts, pasta, cheese, wines. Premium but worth it for specialty items. Online shop at vetro-online.co.nz.", color:'#60a5fa', website:'vetro-online.co.nz', lat:-37.6881, lng:176.1642,
    valueTags:[{label:'🫒 Olive oil',level:'worth'},{label:'🧀 Artisan cheese',level:'worth'},{label:'🍝 Quality pasta',level:'worth'}] },
  { key:'tepunadeli', name:'Te Puna Deli', chain:'Local', area:'Tauriko / West', address:'Te Puna, Tauranga', hours:'Mon-Fri 8am-5pm, Sat-Sun 9am-3pm', type:'Deli / Cafe', tip:"Premium deli. Hungarian salamis made on-site. Stocks Mount Sourdough bread. NZ/imported cheeses, charcuterie, gift boxes.", color:'#60a5fa', website:'tepunadeli.co.nz', lat:-37.6312, lng:176.0534,
    valueTags:[{label:'🥖 Mount Sourdough',level:'worth'},{label:'🧀 NZ cheeses',level:'worth'},{label:'🥩 Charcuterie',level:'worth'}] },
  { key:'simplyorganic', name:'Simply Organic', chain:'Local', area:'Central Tauranga', address:'771 Cameron Road, Tauranga', hours:'Mon-Fri 9am-5pm, Sat 9am-3pm', type:'Organic Store', tip:"One-stop organic. Organic veg, grocery, health, bulk dry goods, frozen, herbs, spices. Online delivery NZ-wide. 8 car parks at rear.", color:'#10b981', website:'simplyorganic.co.nz', lat:-37.7012, lng:176.1598,
    valueTags:[{label:'🌿 Organic veg',level:'worth'},{label:'🌾 Bulk dry goods',level:'worth'},{label:'🫚 Herbs & spices',level:'worth'}] },
  { key:'beorganics', name:'Be Organics', chain:'Local', area:'Mt Maunganui', address:'At Mount Wholefoods, 13 Reed St, Mt Maunganui', hours:'Mon-Fri 7:30am-5:30pm, Sat-Sun 7:30am-4pm', type:'Organic', tip:"Certified organic NZ-grown produce. Sprouts, microgreens, kale, courgettes, eggs. Sold via Mount Wholefoods. Custom boxes from 300g.", color:'#10b981', website:'beorganics.co.nz', lat:-37.6434, lng:176.1876,
    valueTags:[{label:'🌱 Sprouts & microgreens',level:'worth'},{label:'🥚 Organic eggs',level:'worth'},{label:'📦 Custom boxes',level:'worth'}] },
  { key:'familypantry', name:'Family Pantry', chain:'Local', area:'Central Tauranga', address:'Online — familypantry.nz', hours:'Online orders, NZ-wide delivery', type:'Organic Bulk', tip:"Online organic bulk store. Certified organic grains, seeds, nuts, flours, dried fruit. Plastic-free packaging. Min order 200g. Donates near-expiry stock to charity.", color:'#10b981', website:'familypantry.nz', lat:null, lng:null,
    valueTags:[{label:'🥜 Organic nuts',level:'cheaper'},{label:'🌾 Organic grains',level:'cheaper'},{label:'🫘 Lentils & beans',level:'cheaper'}] },
  { key:'gourmettrader', name:'Gourmet Trader', chain:'Local', area:'Central Tauranga', address:'Cameron Road, Gate Pa', hours:'Mon-Fri 9am-5pm, Sat 10am-5pm', type:'Kitchenware / Gourmet', tip:"Expert kitchenware + gourmet sauces, spices and condiments. Not a grocery store — but the place for quality cooking tools and artisan pantry staples.", color:'#60a5fa', lat:-37.7074, lng:176.1612,
    valueTags:[{label:'🍳 Cookware',level:'worth'},{label:'🫙 Artisan pantry',level:'worth'}] },
  { key:'blackforest', name:'Blackforest Gourmet', chain:'Local', area:'Central Tauranga', address:'65 Chapel Street, Tauranga CBD', hours:'Mon-Sat 9am-4pm, Sun 10am-4pm', type:'European Butcher', tip:"German sausages, European smallgoods, cheeses, pate, salamis, smoked meats. Premium European-style. Online shop + NZ-wide delivery.", color:'#e879f9', website:'blackforestgourmet.co.nz', lat:-37.6897, lng:176.1668,
    valueTags:[{label:'🌭 German sausages',level:'worth'},{label:'🧀 European cheese',level:'worth'},{label:'🥩 Smallgoods',level:'worth'}] },
  { key:'merivale', name:'Merivale Butchery', chain:'Local', area:'South Tauranga', address:'1305 Cameron Road, Greerton', hours:'Mon-Fri 7am-5:30pm, Sat 7am-1pm', type:'Butcher', tip:"Traditional butcher. Known for Big Boy sausages (176g) — they make 600-1000kg/week. Beef, lamb, pork, chicken. Everything made in-store.", color:'#e879f9', lat:-37.7268, lng:176.1523,
    valueTags:[{label:'🌭 Big Boy sausages',level:'worth'},{label:'🥩 In-store made',level:'worth'}] },
  { key:'cherrywoodbutchery', name:'Cherrywood Butchery', chain:'Local', area:'North Tauranga', address:'Cherrywood Drive, Otumoetai', hours:'Mon-Fri 7am-6pm, Sat 7am-2pm', type:'Butcher', tip:"Traditional independent butcher. Quality cuts, gourmet items, everything made from scratch in-store.", color:'#e879f9', lat:-37.6821, lng:176.1398,
    valueTags:[{label:'🥩 Fresh cuts',level:'worth'},{label:'🌭 House-made smallgoods',level:'worth'}] },
  { key:'boerewors', name:'Boerewors NZ', chain:'Local', area:'Tauriko / West', address:'761 SH29, Tauriko (+ Mt Maunganui)', hours:'Mon-Fri 9am-5pm, Sat 9am-3pm', type:'Specialty Butcher', tip:"South African boerewors, biltong, drywors, Russian sausages. Family business. NZ-wide shipping Mon-Wed. Also at Mt Maunganui location.", color:'#e879f9', website:'boerewors.nz', lat:-37.7432, lng:176.0812,
    valueTags:[{label:'🇿🇦 Boerewors',level:'worth'},{label:'🥩 Biltong & drywors',level:'worth'}] },
  { key:'mountsourdough', name:'Mount Sourdough', chain:'Local', area:'Mt Maunganui', address:'Mount Maunganui (wholesale — at Te Puna Deli & stockists)', hours:'Available via stockists', type:'Bakery', tip:"Highly rated artisan sourdough bakery. Available at Te Puna Deli and other stockists around Tauranga.", color:'#fbbf24', website:'mountsourdough.com', lat:-37.6378, lng:176.1812,
    valueTags:[{label:'🍞 Artisan sourdough',level:'worth'}] },
  { key:'mountbutchery', name:'Mount Butchery & Deli', chain:'Local', area:'Mt Maunganui', address:'237 Maunganui Road, Mt Maunganui', hours:'Mon-Fri 7:30am-5:30pm, Sat 8am-2pm', type:'Butcher', tip:"Local butcher and deli in central Mount. Fresh meat and deli items.", color:'#e879f9', lat:-37.6321, lng:176.1892,
    valueTags:[{label:'🥩 Fresh cuts',level:'worth'},{label:'🧀 Deli items',level:'worth'}] },
  { key:'bobbysfish', name:"Bobby's Fresh Fish Market", chain:'Local', area:'Central Tauranga', address:'1 Dive Crescent, Tauranga 3110', hours:'Wed-Sun 8am-6pm', type:'Seafood', tip:"Fresh local seafood — fish, salmon, oysters, scallops, mussels. Much fresher and often cheaper than supermarket seafood counters. Closed Mon-Tue.", color:'#38bdf8', lat:-37.6891, lng:176.1748,
    valueTags:[{label:'🐟 Fresh local fish',level:'cheaper'},{label:'🦪 Oysters & scallops',level:'cheaper'},{label:'🦐 Shellfish',level:'cheaper'}] },
];

// ========== AREA DEFINITIONS for Route grouping ==========
const AREAS = [
  'Central Tauranga',
  'North Tauranga',
  'Bethlehem / North',
  'Tauriko / West',
  'South Tauranga',
  'Pyes Pa / Lakes',
  'Welcome Bay / South',
  'Mt Maunganui',
  'Papamoa',
];

// ========== SPECIALS (Updated 2026-06-03) ==========
const SPECIALS = [
  // MEAT & POULTRY
  { item:"Chicken Breast Skinless 1kg", price:12.90, unit:"kg", storeKey:'ww-bethlehem', store:"Woolworths", was:17.40 },
  { item:"Whole Chicken Sage & Onion ~1.3kg", price:14.90, unit:"pack", storeKey:'ww-bethlehem', store:"Woolworths", was:18.90 },
  { item:"Hellers Pork Sausages 6pk", price:8.90, unit:"pack", storeKey:'ww-bethlehem', store:"Woolworths", was:12.00 },
  { item:"Beef Mince 500g", price:8.39, unit:"pack", storeKey:'pns-tauriko', store:"Pak'nSave", was:11.00 },
  { item:"Garlic & Herb Sausages 400g", price:8.70, unit:"pack", storeKey:'ww-bethlehem', store:"Woolworths", was:12.00 },
  { item:"Hellers Manuka Smoked Bacon 600g", price:9.99, unit:"pack", storeKey:'pns-tauriko', store:"Pak'nSave", was:13.99 },

  // FRESH PRODUCE
  { item:"Avocado", price:2.89, unit:"each", storeKey:'pns-tauriko', store:"Pak'nSave", was:3.99 },
  { item:"Brushed Agria Potatoes 3kg", price:8.49, unit:"bag", storeKey:'nw-gatepa', store:"New World", was:10.99 },
  { item:"Brown Onions", price:1.99, unit:"kg", storeKey:'ww-bethlehem', store:"Woolworths", was:2.99 },
  { item:"Sliced Mushrooms 200g", price:3.49, unit:"pack", storeKey:'nw-gatepa', store:"New World", was:4.99 },
  { item:"Iceberg Lettuce", price:3.49, unit:"head", storeKey:'nw-gatepa', store:"New World", was:4.49 },

  // DAIRY & EGGS
  { item:"Eggs 12pk Size 7 (Henergy)", price:9.89, unit:"doz", storeKey:'nw-gatepa', store:"New World", was:13.99 },
  { item:"Mainland Butter 375g", price:12.99, unit:"block", storeKey:'nw-gatepa', store:"New World", was:16.49 },
  { item:"Rolling Meadow Tasty Cheese 500g", price:9.99, unit:"pack", storeKey:'nw-gatepa', store:"New World", was:20.00 },
  { item:"Camembert Cheese 110g", price:3.69, unit:"pack", storeKey:'nw-gatepa', store:"New World", was:5.99 },

  // PANTRY
  { item:"Pams Colby Cheese 500g", price:7.49, unit:"pack", storeKey:'pns-tauriko', store:"Pak'nSave", was:10.00 },
  { item:"Tegel Free Range Crunchy Chicken 800g", price:12.79, unit:"pack", storeKey:'pns-tauriko', store:"Pak'nSave", was:17.99 },
  { item:"Mango (each)", price:3.49, unit:"each", storeKey:'ww-bethlehem', store:"Woolworths", was:4.99 },
];

// ========== HELPERS ==========
function haversineKm(a,b){const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
function permutations(arr){if(arr.length<=1)return[arr];return arr.flatMap((v,i)=>permutations([...arr.slice(0,i),...arr.slice(i+1)]).map(p=>[v,...p]));}
function bestRoute(home,stops,returnHome=true){const perms=permutations(stops);let best=null,bestDist=Infinity;perms.forEach(p=>{const pts=returnHome?[home,...p,home]:[home,...p];let d=0;for(let i=0;i<pts.length-1;i++)d+=haversineKm(pts[i],pts[i+1]);if(d<bestDist){bestDist=d;best=p;}});return{order:best,totalKm:bestDist};}
function storeByKey(k){return ALL_STORES.find(s=>s.key===k);}

// ========== FLOATING PLAN PANEL ==========
function PlanPanel({ planToBuy, planToGo, onRemoveBuy, onRemoveGo, onClearAll }) {
  const [open, setOpen] = useState(false);
  const totalItems = planToBuy.length + planToGo.size;

  return (
    <>
      {/* Floating button */}
      <button onClick={()=>setOpen(!open)} style={{
        position:'fixed', bottom:'max(24px, env(safe-area-inset-bottom))',
        right:16, zIndex:1000,
        background:'linear-gradient(135deg,#059669,#10b981)',
        border:'none', borderRadius:24, padding:'11px 18px',
        color:'white', fontWeight:700, fontSize:13, cursor:'pointer',
        boxShadow:'0 4px 20px rgba(16,185,129,0.4)',
        display:'flex', alignItems:'center', gap:7, fontFamily:"'DM Sans',-apple-system,sans-serif",
      }}>
        🛒 My Plan
        {totalItems > 0 && (
          <span style={{ background:'white', color:'#059669', borderRadius:20, padding:'1px 7px', fontSize:11, fontWeight:800 }}>
            {totalItems}
          </span>
        )}
      </button>

      {/* Slide-up panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:999,
          background:'#0d2e22', borderTop:'1px solid rgba(16,185,129,0.3)',
          borderRadius:'16px 16px 0 0', padding:'20px 16px',
          paddingBottom:'max(32px, calc(env(safe-area-inset-bottom) + 16px))',
          maxHeight:'70vh', overflowY:'auto',
          boxShadow:'0 -8px 40px rgba(0,0,0,0.5)',
          fontFamily:"'DM Sans',-apple-system,sans-serif",
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ color:C.t1, fontWeight:700, fontSize:16 }}>🛒 My Shopping Plan</span>
            <div style={{ display:'flex', gap:8 }}>
              {totalItems > 0 && (
                <button onClick={onClearAll} style={{ padding:'5px 12px', borderRadius:8, border:'1px solid rgba(248,113,113,0.3)', background:'transparent', color:'#f87171', fontSize:12, cursor:'pointer' }}>
                  Clear all
                </button>
              )}
              <button onClick={()=>setOpen(false)} style={{ padding:'5px 12px', borderRadius:8, border:'1px solid '+C.sb, background:'transparent', color:C.t3, fontSize:12, cursor:'pointer' }}>
                Close
              </button>
            </div>
          </div>

          {totalItems === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:C.t3, fontSize:13 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🛍️</div>
              Tap deals in This Week to save items, or tap stores in Store Guide to add shops to your plan.
            </div>
          ) : (
            <>
              {planToGo.size > 0 && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6, marginBottom:8 }}>Shops to visit ({planToGo.size})</div>
                  {[...planToGo].map(key => {
                    const s = storeByKey(key);
                    if (!s) return null;
                    return (
                      <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:C.sf, borderRadius:9, marginBottom:6, border:'1px solid '+C.sb }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:s.color, flexShrink:0, display:'inline-block' }} />
                        <span style={{ flex:1 }}>
                          <span style={{ color:C.t1, fontSize:13, fontWeight:600, display:'block' }}>{s.name}</span>
                          <span style={{ color:C.t3, fontSize:11 }}>{s.area}</span>
                        </span>
                        <button onClick={()=>onRemoveGo(key)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:16, padding:'0 2px' }}>×</button>
                      </div>
                    );
                  })}
                </div>
              )}

              {planToBuy.length > 0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6, marginBottom:8 }}>Items to buy ({planToBuy.length})</div>
                  {planToBuy.map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:C.sf, borderRadius:9, marginBottom:6, border:'1px solid '+C.sb }}>
                      <span style={{ flex:1 }}>
                        <span style={{ color:C.t1, fontSize:13, fontWeight:600, display:'block' }}>{item.item}</span>
                        <span style={{ color:C.t3, fontSize:11 }}>{item.store} · </span>
                        <span style={{ color:C.yl, fontSize:12, fontWeight:700 }}>${item.price}/{item.unit}</span>
                        <span style={{ color:'rgba(255,255,255,0.25)', fontSize:11, textDecoration:'line-through', marginLeft:5 }}>${item.was}</span>
                      </span>
                      <button onClick={()=>onRemoveBuy(i)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:16, padding:'0 2px' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Overlay to close */}
      {open && <div onClick={()=>setOpen(false)} style={{ position:'fixed', inset:0, zIndex:998, background:'rgba(0,0,0,0.4)' }} />}
    </>
  );
}

// ========== SPECIALS TICKER ==========
function SpecialsTicker() {
  return (
    <div style={{ overflow:'hidden', background:'linear-gradient(90deg,#065f46,#047857,#059669)' }}>
      <div style={{ display:'flex', animation:'marquee 50s linear infinite', whiteSpace:'nowrap', padding:'8px 0', minWidth:'200%' }}>
        {[...SPECIALS,...SPECIALS].map((s,i) => (
          <span key={i} style={{ margin:'0 20px', fontSize:'13px', fontWeight:500, color:'#d1fae5' }}>
            🏷️ {s.item}{' '}<span style={{ color:'#fde68a', fontWeight:700 }}>${s.price}/{s.unit}</span>
            <span style={{ color:'#a7f3d0', textDecoration:'line-through', marginLeft:4, fontSize:11 }}>${s.was}</span>
            <span style={{ marginLeft:4 }}>@ {s.store}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .nav-tabs::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ========== NAV ==========
function CitySelector() {
  return (
    <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:20 }}>
      <div style={{ padding:'8px 24px', borderRadius:24, fontSize:14, fontWeight:600, border:'2px solid '+C.ac, background:C.ac, color:'white', boxShadow:'0 2px 12px rgba(16,185,129,0.3)' }}>
        📍 Tauranga
      </div>
    </div>
  );
}

function NavTabs({ active, setActive, planCount }) {
  const tabs = [
    { id:'specials', label:'This Week', icon:'🏷️' },
    { id:'guide', label:'Store Guide', icon:'🗺️' },
    { id:'route', label:'Route', icon:'⛽' },
    { id:'recipes', label:'Recipes', icon:'👨‍🍳' },
    { id:'contribute', label:'Contribute', icon:'🤝' },
    { id:'feedback', label:'Feedback', icon:'📝' },
  ];
  return (
    <div className="nav-tabs" style={{
      display:'flex', gap:3, background:C.sf, borderRadius:12,
      padding:4, border:'1px solid '+C.sb,
      overflowX:'auto', WebkitOverflowScrolling:'touch',
      scrollbarWidth:'none', msOverflowStyle:'none',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          flex:1, padding:'9px 4px', borderRadius:10, border:'none', cursor:'pointer',
          fontSize:11, fontWeight:600, whiteSpace:'nowrap',
          background: active===t.id ? C.ac : 'transparent',
          color: active===t.id ? 'white' : C.t2, transition:'all 0.2s', position:'relative',
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  );
}

// ========== SPECIALS TAB ==========
function SpecialsTab({ planToBuy, onAddBuy, planToGo, onToggleGo }) {
  const storeColors = {"Pak'nSave":'#eab308', Woolworths:'#22c55e', "New World":'#ef4444'};
  const grouped = {};
  SPECIALS.forEach(s => { if(!grouped[s.store]) grouped[s.store]=[]; grouped[s.store].push(s); });
  const [added, setAdded] = useState(null);

  const handleAddItem = (special) => {
    onAddBuy(special);
    if (special.storeKey) onToggleGo(special.storeKey, true);
    setAdded(special.item);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:C.t1, fontWeight:400, marginBottom:4, textAlign:'center' }}>This Week's Best Specials</h2>
      <p style={{ color:C.t2, fontSize:13, textAlign:'center', marginBottom:8 }}>Tap any deal to add it to your shopping plan.</p>
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <a href="https://grocer.nz" target="_blank" rel="noopener" style={{ color:C.t3, fontSize:12, textDecoration:'underline' }}>Compare real-time prices on Grocer.nz ↗</a>
      </div>

      {added && (
        <div style={{ padding:'10px 14px', borderRadius:10, background:C.ad, border:'1px solid '+C.ab, color:C.t3, fontSize:13, marginBottom:12, textAlign:'center' }}>
          ✅ Added to your plan: <strong>{added}</strong>
        </div>
      )}

      {Object.entries(grouped).map(([store, items]) => (
        <div key={store} style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:storeColors[store]||'#6b7280' }} />
            <span style={{ color:C.t1, fontWeight:700, fontSize:16 }}>{store}</span>
          </div>
          {items.map((it,i) => {
            const alreadyAdded = planToBuy.some(p => p.item===it.item && p.storeKey===it.storeKey);
            return (
              <button key={i} onClick={() => !alreadyAdded && handleAddItem(it)} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'9px 10px', borderRadius:9, width:'100%', textAlign:'left',
                background: alreadyAdded ? C.ad : (i%2===0?'rgba(255,255,255,0.02)':'transparent'),
                border: alreadyAdded ? '1px solid '+C.ab : '1px solid transparent',
                cursor: alreadyAdded ? 'default' : 'pointer', transition:'all .15s',
                marginBottom:3,
              }}>
                <span style={{ color:C.t1, fontSize:14 }}>{it.item}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ color:C.yl, fontWeight:700, fontSize:15 }}>${it.price}</span>
                    <span style={{ color:C.t3, fontSize:11 }}>/{it.unit}</span>
                    <span style={{ color:'rgba(255,255,255,0.3)', textDecoration:'line-through', fontSize:11, marginLeft:6 }}>${it.was}</span>
                    <span style={{ color:'#f87171', fontSize:11, marginLeft:4 }}>-{Math.round((1-it.price/it.was)*100)}%</span>
                  </div>
                  <span style={{ fontSize:16, opacity: alreadyAdded ? 1 : 0.4 }}>{alreadyAdded ? '✅' : '+'}</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ========== STORE GUIDE TAB ==========
function StoreGuide({ planToGo, onToggleGo }) {
  const supermarkets = ALL_STORES.filter(s => ['Budget Supermarket','Premium Supermarket','Mid-range Supermarket','Convenience'].includes(s.type));
  const localStores = ALL_STORES.filter(s => !['Budget Supermarket','Premium Supermarket','Mid-range Supermarket','Convenience'].includes(s.type));

  const [openSection, setOpenSection] = useState('supermarkets');
  const toggle = (s) => setOpenSection(openSection === s ? '' : s);

  const Section = ({ id, title, icon, children }) => (
    <div style={{ marginBottom:10 }}>
      <button onClick={() => toggle(id)} style={{ width:'100%', padding:'14px 16px', borderRadius:12, border:'1px solid '+C.sb, background: openSection===id ? C.ad : C.sf, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.2s' }}>
        <span style={{ color:C.t1, fontWeight:600, fontSize:15 }}>{icon} {title}</span>
        <span style={{ color:C.t3, fontSize:18 }}>{openSection===id ? '−' : '+'}</span>
      </button>
      {openSection===id && <div style={{ padding:'12px 0' }}>{children}</div>}
    </div>
  );

  const StoreCard = ({ store }) => {
    const inPlan = planToGo.has(store.key);
    return (
      <div style={{ background:C.sf, border: inPlan ? '1px solid '+C.ac : '1px solid '+C.sb, borderRadius:10, padding:14, marginBottom:8, transition:'all .15s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:store.color }} />
          <span style={{ color:C.t1, fontWeight:700, fontSize:14, flex:1 }}>{store.name}</span>
          <button
            onClick={() => onToggleGo(store.key)}
            style={{
              padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
              border: inPlan ? '1px solid '+C.ac : '1px solid '+C.sb,
              background: inPlan ? C.ac : 'transparent',
              color: inPlan ? 'white' : C.t3,
              transition:'all .15s', flexShrink:0,
            }}
          >
            {inPlan ? '✓ In plan' : '+ Plan to go'}
          </button>
        </div>
        {store.address && <div style={{ color:C.t2, fontSize:12, marginBottom:4 }}>📍 {store.address}</div>}
        {store.hours && <div style={{ color:C.t3, fontSize:11, marginBottom:4 }}>🕐 {store.hours}</div>}
        {store.website && <div style={{ color:C.t3, fontSize:11, marginBottom:4 }}>🔗 <a href={'https://'+store.website} target="_blank" rel="noopener" style={{ color:C.t3 }}>{store.website}</a></div>}
        {store.type && <span style={{ fontSize:11, color:C.t3, background:C.ad, padding:'2px 8px', borderRadius:12, display:'inline-block', marginBottom:6 }}>{store.type} · {store.area}</span>}
        {store.valueTags && store.valueTags.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:8, marginTop:4 }}>
            {store.valueTags.map((tag, i) => (
              <span key={i} style={{
                fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20,
                background: tag.level === 'cheaper' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.1)',
                border: tag.level === 'cheaper' ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(234,179,8,0.3)',
                color: tag.level === 'cheaper' ? '#6ee7b7' : '#fbbf24',
              }}>
                {tag.label}
                {tag.level === 'cheaper' && <span style={{ marginLeft:4, fontSize:10, opacity:0.8 }}>✓ beats supermarket</span>}
              </span>
            ))}
          </div>
        )}
        <div style={{ color:C.yl, fontSize:13, marginTop:6, lineHeight:1.5, background:C.yld, padding:'8px 10px', borderRadius:8, border:'1px solid '+C.ylb }}>
          💡 {store.tip}
        </div>
      </div>
    );
  };

  const byChain = {};
  supermarkets.forEach(s => { if(!byChain[s.chain]) byChain[s.chain]=[]; byChain[s.chain].push(s); });
  const chainColors = {"Pak'nSave":'#eab308', "New World":'#ef4444', Woolworths:'#22c55e', FreshChoice:'#06b6d4', "Four Square":'#f97316'};

  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:16, padding:'12px 0' }}>
        <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:C.t1, fontWeight:400, marginBottom:4 }}>Tauranga Store Guide</h2>
        <p style={{ color:C.t2, fontSize:13 }}>Tap "+ Plan to go" on any store to add it to your route.</p>
      </div>

      <Section id="supermarkets" title={`Supermarkets (${supermarkets.length})`} icon="🏪">
        {Object.entries(byChain).map(([chain, stores]) => (
          <div key={chain} style={{ marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, paddingLeft:4 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:chainColors[chain]||'#6b7280' }} />
              <span style={{ color:C.t2, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>{chain} ({stores.length})</span>
            </div>
            {stores.map((s,i) => <StoreCard key={i} store={s} />)}
          </div>
        ))}
      </Section>

      <Section id="local" title={`Local Stores (${localStores.length})`} icon="🏘️">
        <p style={{ color:C.t2, fontSize:13, marginBottom:10, lineHeight:1.5 }}>These local shops often beat supermarket prices on specific items. Worth the trip!</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
          <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.35)', color:'#6ee7b7' }}>🟢 Green = beats supermarket price</span>
          <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'rgba(234,179,8,0.1)', border:'1px solid rgba(234,179,8,0.3)', color:'#fbbf24' }}>🟡 Yellow = worth it for this category</span>
        </div>
        {localStores.map((s,i) => <StoreCard key={i} store={s} />)}
      </Section>

      <Section id="markets" title="Markets (2)" icon="🌾">
        {[
          { name:'Tauranga Farmers Market', when:'Saturday mornings', where:'Various locations', tip:'Fresh local produce. Arrive early. Bring cash.' },
          { name:'Mount Maunganui Market', when:'Weekends', where:'Mount Maunganui', tip:'Good for specialty items and artisan products.' },
        ].map((s,i) => (
          <div key={i} style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:10, padding:14, marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#8b5cf6' }} />
              <span style={{ color:C.t1, fontWeight:700, fontSize:14 }}>{s.name}</span>
            </div>
            <div style={{ color:C.t3, fontSize:12, marginBottom:4 }}>📅 {s.when}</div>
            <div style={{ color:C.t2, fontSize:12, marginBottom:4 }}>📍 {s.where}</div>
            <div style={{ color:C.yl, fontSize:13, background:C.yld, padding:'8px 10px', borderRadius:8, border:'1px solid '+C.ylb }}>💡 {s.tip}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

// ========== ROUTE PLANNER TAB ==========
function RoutePlannerTab({ planToGo, onToggleGo }) {
  const [homeAddr, setHomeAddr] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [returnHome, setReturnHome] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [synced, setSynced] = useState(false);

  const syncFromPlan = () => {
    setSelected(new Set(planToGo));
    setSynced(true);
    setResult(null);
  };

  const toggle = (key) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
    setResult(null);
  };

  const HOME_PT = { lat:-37.6878, lng:176.1651 };

  const plan = () => {
    if (!homeAddr.trim()) { setError('Please enter your starting address.'); return; }
    const stops = [...selected].map(key => ALL_STORES.find(s=>s.key===key)).filter(Boolean);
    if (stops.length < 2) { setError('Please select at least 2 shops.'); return; }
    if (stops.length > 8) { setError('Maximum 8 shops for route planning.'); return; }
    setError('');
    const { order, totalKm } = bestRoute(HOME_PT, stops, returnHome);
    setResult({ order, totalKm });
  };

  const getMapsUrl = (order) => {
    const origin = encodeURIComponent(homeAddr.trim()||'Tauranga, NZ');
    const dest = returnHome ? encodeURIComponent(homeAddr.trim()||'Tauranga, NZ') : encodeURIComponent(order[order.length-1].address);
    const wpStops = returnHome ? order : order.slice(0,-1);
    const waypoints = wpStops.map(s=>encodeURIComponent(s.address)).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypoints?'&waypoints='+waypoints:''}&travelmode=driving`;
  };

  const is = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid '+C.ab, background:'rgba(0,0,0,0.3)', color:C.t1, fontSize:16, outline:'none', fontFamily:'inherit' };
  const toggleBtn = (active) => ({ flex:1, padding:'9px 0', borderRadius:9, border:active?'1px solid '+C.ac:'1px solid '+C.sb, background:active?C.ac:'transparent', color:active?'white':C.t2, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s' });

  const storesByArea = {};
  ALL_STORES.filter(s=>s.lat).forEach(s=>{
    if(!storesByArea[s.area]) storesByArea[s.area]=[];
    storesByArea[s.area].push(s);
  });

  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:16, padding:'12px 0' }}>
        <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:C.t1, fontWeight:400, marginBottom:4 }}>⛽ Smart Route Planner</h2>
        <p style={{ color:C.t2, fontSize:13 }}>Pick your shops — we'll find the shortest order to save fuel.</p>
        <div style={{ marginTop:6, fontSize:11, color:C.t3 }}>📍 Tauranga · Straight-line distance estimate</div>
      </div>

      <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16, marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6, marginBottom:8 }}>1 · Your starting address</div>
        <div style={{ display:'flex', gap:8 }}>
          <input value={homeAddr} onChange={e=>{setHomeAddr(e.target.value);setResult(null);}} placeholder="e.g. 14 Spring Street, Tauranga" style={{ ...is, flex:1 }} />
          <button onClick={()=>{setHomeAddr('Tauranga City Centre');setResult(null);}} style={{ padding:'10px 12px', borderRadius:10, border:'1px solid '+C.ab, background:'transparent', color:C.t3, fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
            📍 City centre
          </button>
        </div>
      </div>

      <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16, marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6 }}>2 · Shops to visit</div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ fontSize:11, color:C.t3 }}>{selected.size} selected</span>
            {planToGo.size > 0 && (
              <button onClick={syncFromPlan} style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', border:'1px solid '+C.ac, background: synced?C.ac:C.ad, color: synced?'white':C.t3 }}>
                {synced ? '✓ Synced' : `⟳ Use my plan (${planToGo.size})`}
              </button>
            )}
          </div>
        </div>

        {AREAS.map(area => {
          const areaStores = storesByArea[area]||[];
          if(!areaStores.length) return null;
          const areaSelected = areaStores.filter(s=>selected.has(s.key)).length;
          return (
            <div key={area} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                <span style={{ fontSize:11, color:C.t3, fontWeight:600 }}>📍 {area}</span>
                {areaSelected > 0 && <span style={{ fontSize:10, background:C.ad, color:C.t3, padding:'1px 6px', borderRadius:20 }}>{areaSelected}</span>}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:5 }}>
                {areaStores.map((s) => (
                  <button key={s.key} onClick={()=>toggle(s.key)} style={{
                    display:'flex', alignItems:'center', gap:7, padding:'8px 10px',
                    borderRadius:8, border: selected.has(s.key)?'1px solid '+C.ac:'1px solid '+C.sb,
                    background: selected.has(s.key)?C.ad:'transparent',
                    cursor:'pointer', textAlign:'left', width:'100%', transition:'all .15s',
                  }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0, display:'inline-block' }} />
                    <span>
                      <span style={{ fontSize:11, color:C.t1, fontWeight:500, display:'block', lineHeight:1.3 }}>{s.name}</span>
                      <span style={{ fontSize:9, color:C.t3 }}>{s.type}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16, marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>3 · End of trip</div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={toggleBtn(returnHome)} onClick={()=>{setReturnHome(true);setResult(null);}}>🏠 Return home</button>
          <button style={toggleBtn(!returnHome)} onClick={()=>{setReturnHome(false);setResult(null);}}>🛑 Stop at last shop</button>
        </div>
        <div style={{ marginTop:8, fontSize:12, color:C.t3, lineHeight:1.5 }}>
          {returnHome ? 'Route loops back. Google Maps destination will be set to your home address.' : "Route ends at the last shop — useful if you're heading somewhere else after."}
        </div>
      </div>

      {error && <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:13, marginBottom:10 }}>⚠️ {error}</div>}

      <button onClick={plan} disabled={selected.size<2} style={{
        width:'100%', padding:13, borderRadius:10, border:'none',
        background: selected.size<2?'#064e3b':'linear-gradient(135deg,#059669,#10b981)',
        color:'white', fontWeight:700, fontSize:14, cursor:selected.size<2?'not-allowed':'pointer',
        opacity:selected.size<2?0.4:1, fontFamily:'inherit', marginBottom:10,
      }}>⛽ Plan My Route</button>

      {result && (
        <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
            {[
              { val:result.totalKm.toFixed(1)+' km', lbl:'Est. distance' },
              { val:'~'+Math.round(result.totalKm/0.5)+' min', lbl:'Drive time' },
              { val:result.order.length+' stops', lbl:'Shops' },
            ].map((s,i) => (
              <div key={i} style={{ background:C.yld, border:'1px solid '+C.ylb, borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:700, color:C.yl }}>{s.val}</div>
                <div style={{ fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:.4, marginTop:2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize:11, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>Suggested order</div>

          <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', borderBottom:'1px solid '+C.sb }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🏠</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>Start</div>
              <div style={{ fontSize:12, color:C.t2 }}>{homeAddr}</div>
            </div>
          </div>

          {result.order.map((s, i) => {
            const prev = i===0 ? HOME_PT : { lat:result.order[i-1].lat, lng:result.order[i-1].lng };
            const d = haversineKm(prev, {lat:s.lat,lng:s.lng});
            return (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', borderBottom:'1px solid '+C.sb }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{s.address}</div>
                  <div style={{ fontSize:11, color:C.t3, marginTop:3 }}>↑ {d.toFixed(1)} km from previous</div>
                </div>
              </div>
            );
          })}

          {returnHome && (() => {
            const last = result.order[result.order.length-1];
            const d = haversineKm({lat:last.lat,lng:last.lng}, HOME_PT);
            return (
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0' }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🏠</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>Back home</div>
                  <div style={{ fontSize:12, color:C.t2 }}>{homeAddr}</div>
                  <div style={{ fontSize:11, color:C.t3, marginTop:3 }}>↑ {d.toFixed(1)} km return</div>
                </div>
              </div>
            );
          })()}

          <a href={getMapsUrl(result.order)} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14, padding:'12px 16px', borderRadius:10, border:'1px solid '+C.ab, background:'transparent', color:C.t3, fontSize:13, fontWeight:600, textDecoration:'none' }}
            onMouseOver={e=>{e.currentTarget.style.background=C.ad;e.currentTarget.style.color=C.t2;}}
            onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.t3;}}>
            🗺️ Open in Google Maps ↗
          </a>
          <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:8 }}>Distances are straight-line estimates · Actual roads may vary</div>
        </div>
      )}
    </div>
  );
}

// ========== RECIPES TAB ==========
function RecipesTab() {
  const sites = [
    { name:"recipes.co.nz", tagline:"NZ's home cooking hub", desc:"The biggest NZ recipe site — budget-friendly, seasonal, built around Kiwi pantry staples. Great 'budget-friendly' section with under-$15 family meals.", url:"https://recipes.co.nz/budget-friendly/", tags:["Budget","Family","Quick"], color:"#10b981" },
    { name:"NZ Woman's Weekly Food", tagline:"Flat dinners & family meals", desc:"Trusted NZ recipes including 20+ budget flat dinners, kumara dishes, and slow cooker classics. Reliable, crowd-tested recipes.", url:"https://www.nzwomansweeklyfood.co.nz/dinner/budget-friendly-flatting-dinner-recipes-34975/", tags:["Flat dinners","Family","Slow cooker"], color:"#f97316" },
    { name:"Frugal Kiwi", tagline:"Budget cooking NZ-style", desc:"Recipes built around what's cheap at PnSave this week. Strong focus on batch cooking, meal prep, and reducing food waste.", url:"https://frugalkiwi.co.nz/10-budget-friendly-nz-recipes-for-savvy-frugal-living/", tags:["Budget","Batch cook","Frugal"], color:"#eab308" },
    { name:"NZ's Favourite Recipe", tagline:"Classic Kiwi recipes", desc:"Community-submitted Kiwi favourites — pavlova, mince dishes, banana cake, crockpot meals. The classics your nana would recognise.", url:"https://www.nzfavouriterecipe.co.nz/", tags:["Classic","Community","Kiwi"], color:"#8b5cf6" },
    { name:"Pak'nSave Savey Meal-Bot", tagline:"AI meal planner from leftovers", desc:"PnSave's AI meal planner builds recipes from what you have at home — great for using up leftover specials. Also has Aisle of Value weekly deals.", url:"https://www.paknsave.co.nz/", tags:["AI","Specials","Quick"], color:"#fbbf24" },
    { name:"New World Recipes", tagline:"Fresh & seasonal NZ cooking", desc:"Ties directly to weekly specials — search by ingredient to cook around what's on sale this week.", url:"https://www.newworld.co.nz/inspiration/recipes", tags:["Seasonal","Specials","Fresh"], color:"#ef4444" },
  ];
  const tips = ["Use Grocer.nz to compare prices across all major supermarkets before your shop.","Buy meat in bulk from a local butcher and freeze in portions — fresher and cheaper than supermarket.","GLAD-wrapped meat is packed in-store and is much fresher than pre-packaged trays.","Frozen vegetables are nutritionally equal to fresh and create zero waste. Stock up when on special.","Asian supermarkets sell eggs, rice, sauces, and spices at significantly lower prices.","Bin Inn sells nuts at roughly half the supermarket price. BYO containers for 5% extra off.","Cook in bulk on Sunday, portion into containers for weekday lunches. Saves $30-50/week.","Pak'nSave's Savey Meal-Bot: type in your leftover ingredients and it suggests meals.","Club+ rewards launched June 2026 across Pak'nSave, New World and Four Square — sign up free."];

  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:16, padding:'12px 0' }}>
        <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:C.t1, fontWeight:400, marginBottom:4 }}>Recipe & Cooking Resources</h2>
        <p style={{ color:C.t2, fontSize:13 }}>The best NZ recipe sites for budget Kiwi cooking — all free.</p>
      </div>
      <div style={{ display:'grid', gap:10, marginBottom:20 }}>
        {sites.map((s,i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block' }}>
            <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16, transition:'all .15s', cursor:'pointer' }}
              onMouseOver={e=>{e.currentTarget.style.borderColor=s.color;}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0, marginTop:4 }} />
                <div style={{ flex:1 }}>
                  <span style={{ color:C.t1, fontWeight:700, fontSize:15 }}>{s.name}</span>
                  <span style={{ fontSize:11, color:C.t3, marginLeft:6 }}>↗</span>
                  <div style={{ fontSize:12, color:s.color, marginTop:1 }}>{s.tagline}</div>
                </div>
              </div>
              <p style={{ color:C.t2, fontSize:13, lineHeight:1.5, marginBottom:8 }}>{s.desc}</p>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {s.tags.map((t,j) => <span key={j} style={{ fontSize:10, color:C.t3, background:'rgba(255,255,255,0.05)', border:'1px solid '+C.sb, padding:'2px 8px', borderRadius:20 }}>{t}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:12, padding:16 }}>
        <h3 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, color:C.t1, fontWeight:500, marginBottom:12 }}>General Savings Tips</h3>
        {tips.map((tip,i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <span style={{ color:C.ac, flexShrink:0, marginTop:2 }}>✦</span>
            <span style={{ color:C.t2, fontSize:13, lineHeight:1.5 }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== CONTRIBUTE TAB ==========
const KETE_EMAIL = 'baroquepearllover@gmail.com';

function ContributeTab() {
  const [form, setForm] = useState({ storeName:'', storeType:'butcher', city:'', location:'', website:'', deals:'', name:'' });
  const [submitted, setSubmitted] = useState(false);
  const types = [{v:'butcher',l:'🥩 Butcher'},{v:'produce',l:'🥬 Fruit & Veg'},{v:'asian',l:'🍜 Asian Grocery'},{v:'bakery',l:'🍞 Bakery'},{v:'seafood',l:'🐟 Seafood'},{v:'dairy',l:'🧀 Cheese/Dairy'},{v:'bulk',l:'📦 Bulk Store'},{v:'market',l:'🌾 Market'},{v:'other',l:'🏪 Other'}];
  const is = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid '+C.ab, background:'rgba(0,0,0,0.3)', color:C.t1, fontSize:16, outline:'none', marginBottom:12 };
  const ls = { display:'block', color:C.t3, fontSize:11, fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' };

  const handleSubmit = () => {
    if (!form.storeName || !form.location || !form.city) return;
    const subject = encodeURIComponent(`[Kete Tauranga] New store: ${form.storeName}`);
    const body = encodeURIComponent(
      `Store Name: ${form.storeName}\n` +
      `Type: ${form.storeType}\n` +
      `City: ${form.city}\n` +
      `Address: ${form.location}\n` +
      `Website: ${form.website || '—'}\n` +
      `Deals / Notes: ${form.deals || '—'}\n` +
      `Submitted by: ${form.name || 'Anonymous'}`
    );
    window.location.href = `mailto:${KETE_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const canSubmit = form.storeName && form.location && form.city;

  return (
    <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:14, padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>🤝</div>
        <h3 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, color:C.t1, fontWeight:500, marginBottom:6 }}>Share a Local Hidden Gem</h3>
        <p style={{ color:C.t2, fontSize:13 }}>Know a great local store? Help fellow Kiwis save money.</p>
        <p style={{ color:C.t3, fontSize:11, marginTop:6 }}>Tapping Submit will open your email app with everything pre-filled — just hit send.</p>
      </div>
      {submitted && <div style={{ padding:12, borderRadius:10, background:C.ad, border:'1px solid '+C.ab, color:C.t3, fontSize:14, marginBottom:16, textAlign:'center' }}>✅ Email app opened — thanks for contributing!</div>}
      <label style={ls}>Store Name *</label>
      <input value={form.storeName} onChange={e=>setForm({...form,storeName:e.target.value})} placeholder="e.g. Dave's Quality Meats" style={is} />
      <label style={{...ls,marginBottom:6}}>Store Type</label>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
        {types.map(t=><button key={t.v} onClick={()=>setForm({...form,storeType:t.v})} style={{ padding:'5px 12px', borderRadius:20, fontSize:12, cursor:'pointer', border:form.storeType===t.v?'1px solid '+C.ac:'1px solid '+C.sb, background:form.storeType===t.v?C.ac:'transparent', color:form.storeType===t.v?'white':C.t2 }}>{t.l}</button>)}
      </div>
      <label style={ls}>City *</label>
      <input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="e.g. Tauranga, Whakatāne, Hamilton..." style={is} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12, marginTop:-6 }}>
        {['Tauranga','Rotorua','Napier','Whakatāne','Hamilton','Other'].map(c=>(
          <button key={c} onClick={()=>setForm({...form,city:c})} style={{ padding:'3px 10px', borderRadius:20, fontSize:11, cursor:'pointer', border:'1px solid '+C.sb, background:form.city===c?C.ac:'transparent', color:form.city===c?'white':C.t3 }}>{c}</button>
        ))}
      </div>
      <label style={ls}>Address *</label>
      <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. 42 Lake Rd" style={is} />
      <label style={ls}>Website / Facebook (optional)</label>
      <input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="e.g. facebook.com/store or store.co.nz" style={is} />
      <label style={ls}>Deals / Price Notes</label>
      <textarea value={form.deals} onChange={e=>setForm({...form,deals:e.target.value})} placeholder="e.g. Chicken mince 500g for $7. Open Tue-Sat 8am-5pm." rows={3} style={{...is,resize:'vertical'}} />
      <label style={ls}>Your Name (optional)</label>
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="So we can credit your contribution" style={is} />
      <button onClick={handleSubmit} disabled={!canSubmit} style={{ width:'100%', padding:12, borderRadius:10, border:'none', background:!canSubmit?'#064e3b':'linear-gradient(135deg,#059669,#10b981)', color:'white', fontWeight:700, fontSize:14, cursor:!canSubmit?'not-allowed':'pointer', opacity:!canSubmit?0.5:1 }}>
        📤 Submit Store via Email
      </button>
    </div>
  );
}

// ========== FEEDBACK TAB ==========
function FeedbackTab() {
  const [type, setType] = useState('suggestion');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const types = [{v:'suggestion',l:'💡 Feature Idea',d:"Something you wish this app could do"},{v:'bug',l:'🐛 Bug Report',d:"Something isn't working"},{v:'data',l:'📊 Price Update',d:'A price or store detail is wrong'},{v:'general',l:'💬 General',d:'Anything else'}];
  const ph = {suggestion:"I wish Kete could...",bug:"When I tried to...",data:"The price of X at Y is actually $...",general:"Your thoughts..."};
  const typeLabels = {suggestion:'Feature Idea',bug:'Bug Report',data:'Price Update',general:'General'};

  const handleSend = () => {
    if (!text.trim()) return;
    const subject = encodeURIComponent(`[Kete Tauranga] ${typeLabels[type]}`);
    const body = encodeURIComponent(`Type: ${typeLabels[type]}\n\n${text.trim()}`);
    window.location.href = `mailto:${KETE_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setText('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ background:C.sf, border:'1px solid '+C.sb, borderRadius:14, padding:24 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>📝</div>
        <h3 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, color:C.t1, fontWeight:500, marginBottom:6 }}>Help Us Improve</h3>
        <p style={{ color:C.t2, fontSize:13 }}>Kete Tauranga is a work in progress. Your feedback shapes what we build next.</p>
        <p style={{ color:C.t3, fontSize:11, marginTop:6 }}>Tapping Send will open your email app with your message pre-filled.</p>
      </div>
      {submitted && <div style={{ padding:14, borderRadius:10, background:C.ad, border:'1px solid '+C.ab, color:C.t3, fontSize:14, marginBottom:16, textAlign:'center' }}>✅ Email app opened — thank you!</div>}
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {types.map(t=><button key={t.v} onClick={()=>setType(t.v)} style={{ flex:'1 1 45%', padding:12, borderRadius:10, cursor:'pointer', textAlign:'left', border:type===t.v?'1px solid '+C.ac:'1px solid '+C.sb, background:type===t.v?C.ad:'transparent' }}>
          <div style={{ fontSize:14, color:C.t1, marginBottom:2 }}>{t.l}</div>
          <div style={{ fontSize:11, color:C.t3 }}>{t.d}</div>
        </button>)}
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={ph[type]} rows={5} style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid '+C.ab, background:'rgba(0,0,0,0.3)', color:C.t1, fontSize:16, outline:'none', resize:'vertical', marginBottom:14, lineHeight:1.5 }} />
      <button onClick={handleSend} disabled={!text.trim()} style={{ width:'100%', padding:12, borderRadius:10, border:'none', background:!text.trim()?'#064e3b':'linear-gradient(135deg,#059669,#10b981)', color:'white', fontWeight:700, fontSize:14, cursor:!text.trim()?'not-allowed':'pointer', opacity:!text.trim()?0.5:1 }}>
        📨 Send Feedback via Email
      </button>
    </div>
  );
}

// ========== MAIN ==========
export default function App() {
  const [tab, setTab] = useState('specials');
  const [planToBuy, setPlanToBuy] = useState([]);
  const [planToGo, setPlanToGo] = useState(new Set());

  const addBuy = useCallback((special) => {
    setPlanToBuy(prev => {
      if (prev.some(p => p.item===special.item && p.storeKey===special.storeKey)) return prev;
      return [...prev, special];
    });
  }, []);

  const removeBuy = useCallback((idx) => {
    setPlanToBuy(prev => prev.filter((_,i)=>i!==idx));
  }, []);

  const toggleGo = useCallback((key, forceAdd=false) => {
    setPlanToGo(prev => {
      const n = new Set(prev);
      if (forceAdd) { n.add(key); return n; }
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }, []);

  const clearAll = useCallback(() => {
    setPlanToBuy([]);
    setPlanToGo(new Set());
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(170deg,#021a13 0%,#0a2e23 40%,#0d3b2e 100%)', color:C.t1, fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet" />
      <SpecialsTicker />
      <div style={{ maxWidth:640, margin:'0 auto', padding:'20px 16px 100px' }}>
        <div style={{ textAlign:'center', marginBottom:16, paddingTop:8 }}>
          <div style={{ fontSize:13, color:C.t3, fontWeight:600, letterSpacing:3, textTransform:'uppercase', marginBottom:6 }}>🧺 Kete Tauranga</div>
          <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:32, fontWeight:400, color:C.t1, lineHeight:1.2, marginBottom:6 }}>Eat well. Spend smart.</h1>
          <p style={{ color:C.t2, fontSize:14 }}>Your local guide to saving on groceries in Tauranga</p>
          <div style={{ marginTop:8, fontSize:11, color:C.t3 }}>📅 Specials updated: 1 Jun 2026 · 📊 {SPECIALS.length} deals · 🏪 {ALL_STORES.length} stores</div>
        </div>
        <CitySelector />
        <div style={{ marginBottom:16 }}><NavTabs active={tab} setActive={setTab} planCount={planToBuy.length+planToGo.size} /></div>
        {tab==='specials' && <SpecialsTab planToBuy={planToBuy} onAddBuy={addBuy} planToGo={planToGo} onToggleGo={toggleGo} />}
        {tab==='guide' && <StoreGuide planToGo={planToGo} onToggleGo={toggleGo} />}
        {tab==='route' && <RoutePlannerTab planToGo={planToGo} onToggleGo={toggleGo} />}
        {tab==='recipes' && <RecipesTab />}
        {tab==='contribute' && <ContributeTab />}
        {tab==='feedback' && <FeedbackTab />}
        <div style={{ textAlign:'center', marginTop:36, fontSize:11, color:'rgba(16,185,129,0.3)' }}>
          <p>Kete Tauranga v1.0 · Built with 🧺 in Tauranga</p>
          <p style={{ marginTop:4 }}>Prices vary. Use <a href="https://grocer.nz" target="_blank" rel="noopener" style={{ color:'rgba(16,185,129,0.5)', textDecoration:'underline' }}>Grocer.nz</a> for real-time comparison.</p>
        </div>
      </div>
      <PlanPanel planToBuy={planToBuy} planToGo={planToGo} onRemoveBuy={removeBuy} onRemoveGo={(k)=>toggleGo(k)} onClearAll={clearAll} />
    </div>
  );
}
