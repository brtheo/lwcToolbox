const cssProps = /*css*/
`--stellWhite: white;
--stellBrandBlue: #243782;
--stellBrandBlueLighter: #4055a8;
--stellAnthracite: #282b34;
--stellAnthraciteLighter: #4d525e;
--stellAnthraciteDarker: #171924;
--stellErrorColor: #f99494; 
--stellTangerine: #e94e24;
--stellTangerineLighter: #f39671;
--stellTangerineDarker: #e42313;
--stellMint: #43aaa0;
--stellMintLighter: #a0d4cd;
--stellMintDarker: #006e6a;
--stellOrange: #eca935;
--stellOrangeLighter: #fecd50;
--stellOrangeDarker: #ef7d00;
--stellGray: #F3F2EF;
--stellTransparencyColor: #ffffff20;
--stellAccentColor: var(--stellBrandBlue);
--stellAccentColorLighter: var(--stellBrandBlueLighter);
--textColor: var(--stellWhite);`
if(!document.documentElement.style.getPropertyValue('--stellBrandBlue')) {
  for(const [k,v] of cssProps.split('\n').map(line =>line.split(':'))) {
    console.log('## css generation')
    document.documentElement.style.setProperty(k, v.replace(';',''));
  }
  
  // document.documentElement.style.setProperty('--stellYellow', 'green');
}


export default function stellCustomProperties(){}