import React, { useState } from 'react';
//import logo from './logo.svg';
import pic from './Measurements.png';
import './App.css';

function App() {
	//let beta=10; //grader
	//let V=40*1852/3600;
	//let b=14*0.3048;

	//let VCG=2*0.3048;
	//let epsilon = 4;
	//let f=0.5*0.3048;
	const [V, setV]=useState(40);
	const [beta, setBeta]=useState(10);
	const [b, setB]=useState(14*0.3048);

	const [LCG, setLCG]=useState(29*0.3048);
	const [VCG, setVCG]=useState(2*0.3048);

	const [epsilon, setEpsilon]=useState(4);
	const [f, setF]=useState(0.5*0.3048);
	const tau=2;
	
	const constants={
		"g": 9.81,
		"rho": 1025,
		"nu": 1.004e-6
	}
	let boatData={
		"beta": 10,
		"V": 40*1852/3600
	}
	//let depl=60000*0.453592*constants.g; // i N
	const [depl, setDepl]=useState(60000*0.453592*constants.g);
	//const [inputData, setInputData] = useState( { text1 : "", text2: ""});
	
	const [inputData, setInputData] = useState( { 
	V : 40*1852/3600, 
	beta: 10,
	b: 14*0.3048,
	LCG: 29*0.3048,
	VCG: 2*0.3048,
	epsilon: 4,
	f: 0.5*0.3048,
	tau: 2,
	depl: 60000*0.453592*constants.g
	});
	
	
	const [result, setResult]=useState();
	
	function runCalc()
	{
		setResult(SavitskyCalculations(constants, inputData));
	}
		
		
//	        <img src={logo} className="App-logo" alt="logo" />

  return (
	<div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="http://www.westlawn.edu/ReferenceInfo/SavitskyPlaningHulls1964.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the paper!
        </a>
		
		<img src={pic} className="Pic" alt="bla" />
        <>g={constants.g}, </>
		<>&rho;={constants.rho}, </>
		<>&nu;={constants.nu}</>
		
		<label>
		Average deadrise [deg]
			<input type="number" value={inputData.beta} onChange={e => setInputData({...inputData, "beta" :  e.target.value})}/>
		</label>
		
		<label>
		Speed [kn]
			<input type="number" value={inputData.V} onChange={e=>setInputData(e.target.value)}/>
		</label>
		
		<label>
		Beam [m]
			<input type="number" value={b} onChange={e=>setB(e.target.value)}/>
		</label>		

		<label>
		Depl [m<sup>3</sup>]
			<input type="number" value={depl} onChange={e=>setDepl(e.target.value)}/>
		</label>

		<label>
		LCG [m]
			<input type="number" value={LCG} onChange={e=>setLCG(e.target.value)}/>
		</label>

		<label>
		VCG [m]
			<input type="number" value={VCG} onChange={e=>setVCG(e.target.value)}/>
		</label>

		<label>
		&epsilon; [m]
			<input type="number" value={epsilon} onChange={e=>setEpsilon(e.target.value)}/>
		</label>
		
		<label>
		f [m]
			<input type="number" value={f} onChange={e=>setF(e.target.value)}/>
		</label>

		<label>
			<input type="submit" value="Calc" onClick={()=>runCalc(tau)}/>
		</label>
		
		<p>
		{result}
		</p>
		
      </header>
    </div>
  );
}
		
function SavitskyCalculations(con, data){ //g, rho, nu, beta, V, b, depl, LCG, epsilon, f, tau){
	const tau11=Math.pow(data.tau, 1.1);
	const CV=data.V/Math.sqrt(con.g*data.b);
	const CLbeta=data.depl/(0.5*con.rho*Math.pow(data.V,2)*Math.pow(data.b,2));
	
	const CL0=findX(CLbetaCalc, CLbeta, data);
	
	const CL0divtau11=CL0/tau11;

	const lambda=findX(CL0divtau11Calc, CL0divtau11, CV);
	
	const V1=data.V*Math.sqrt(1-0.012*Math.pow(data.tau, 1.1)/(Math.pow(lambda, 0.5)*cosd(data.tau)));

	const Re=V1*lambda*data.b/con.nu;

	
	const Cf= 0.075/Math.pow((Math.log10(Re)-2), 2);

	const deltaCf=0.0004;

	const Df=con.rho*(Math.pow(V1,2))*lambda*(Math.pow(data.b,2))*(Cf+deltaCf)/(2*cosd(data.beta));

	const row14=data.depl*tand(data.tau);

	const row15=Df/cosd(data.tau);
  
	const D=data.depl*tand(data.tau)+Df/cosd(data.tau);

	const Cp=0.75 - 1/((5.21*Math.pow(CV,2))/Math.pow(lambda,2)+2.39);

	const row18=Cp*lambda*data.b;
    
	const c=data.LCG-Cp*lambda*data.b;

	const a=data.VCG-(data.b/4)*tand(data.beta);

	const row22=sind(data.tau+data.epsilon);
	
	const row23=1-sind(data.tau)*sind(data.tau+data.epsilon);

	const row24b=row23*(c/cosd(data.tau));
	const row24=(1-sind(data.tau)*sind(data.tau+data.epsilon))*(c/cosd(data.tau));

	const row25=data.f*sind(data.tau);

	const row26=row24-row25;

	const row27=data.depl*row26;

	const row28=a-data.f;
	const row29=Df*(a-data.f);

	const row30=row27+row29;
	
	const N=data.depl*(1-sind(data.tau)*sind(data.tau+data.epsilon))/cosd(data.tau); // 34

	const eq35part1=data.depl*( (1-sind(data.tau)*sind(data.tau+data.epsilon))*c/cosd(data.tau) - data.f*sind(data.tau));
  
	const eq35part2=Df*(a-data.f);
	const eq35=data.depl*( (1-sind(data.tau)*sind(data.tau+data.epsilon))*c/cosd(data.tau) - data.f*sind(data.tau)) + Df*(a-data.f) // should be =0
  
	//for horizontal equilibrium of forces:
	const T=(Df*cosd(data.tau)+N*sind(data.tau))/(cosd(data.tau+data.epsilon));
  
	const verticalEquilibrium=N*cosd(data.tau)+T*sind(data.tau+data.epsilon)-Df*sind(data.tau);
	const equilibriumOfPithchingMoments=N*c+Df*a-T*data.f;
	
	return (
	<>
		<>
			{con.g}, {data.depl}
		</>
		&tau;<sub>1.1</sub>={tau11}
		<p>
			CV={CV}
		</p>
		<p>
			CLbeta={CLbeta}
		</p>
		<p>
			CL0={CL0}
		</p>
		<p>
			CL0divtau11={CL0divtau11}
		</p>
		<p>
			&lambda;={lambda}
		</p>
		<p>
			V1={V1}
		</p>
		<p>
			Re={Re}
		</p>
		<p>
			row30={row30}
		</p>
		
				<p>
			eq35={eq35}
		</p>
				<p>
			T={T}
		</p>
				<p>
			verticalEquilibrium={verticalEquilibrium}
		</p>
						<p>
			equilibriumOfPithchingMoments={equilibriumOfPithchingMoments}
		</p>
	</>);
}

function sind(angleDegrees) {
    return Math.sin(angleDegrees*Math.PI/180);
};
function cosd(angleDegrees) {
    return Math.cos(angleDegrees*Math.PI/180);
};
function tand(angleDegrees) {
    return Math.tan(angleDegrees*Math.PI/180);
};

function findX(func,yGoal, args){
	const x0=1;
	const y0=func(x0, args);

	let x=x0;

	let dx=1/1000000000;
	let y=y0;
	y=func(x, args);

	while(Math.abs(yGoal-y)>0.0000000001){
		let dy=func(x+dx, args)-func(x, args);
		let deriv=dx/dy;

		x=x+(yGoal-y)*deriv;
		y=func(x, args);
	}
	return x;
}

function CLbetaCalc(CL0, args){
	  const beta=args.beta;
	  const CLbeta=CL0-0.0065*beta*Math.pow(CL0, 0.6); // (16) figure 11 
  return CLbeta;
}

function CL0divtau11Calc(lambda, args){
  const CV=args;
  const CL0divtau11=(0.012*Math.pow(lambda, 0.5) + 0.0055*Math.pow(lambda, 2.5)/Math.pow(CV,2));
  return CL0divtau11;
}

export default App;







