#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform bool  uSmooth;
uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform vec4  uSquareColor;

void
main( )
{

	float s = vST.s;
	float t = vST.t;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( s / uAd );
int numint = int( t / uBd );
	float sc = numins *uAd + Ar;
	float tc = numint *uBd + Br;

	float val1 = (s-sc)/Ar;
	float val2 = (t-tc)/Br;
	val1 = pow(val1,2);
	val2 = pow(val2,2);
	float num = val1 + val2;

	if(uSmooth)
	{
		if(num <= 1.0+uTol && num >= 1.0 -uTol)
		{
			float dist = 2.0*uTol;
			float aNum = 1.0 - uTol;
			float newV = abs(num - aNum);
			float t = newV/dist;	
			gl_FragColor = mix( uSquareColor, vColor,t );
		}
		if(num <= 1.0 - uTol)
		{
			gl_FragColor = uSquareColor;
		}
		if(num >= 1.0 + uTol)
		{
			gl_FragColor = vec4(1.0,1.0,1.0,1.0);
		}
		
	}
	else
	{
		if(num <= 1.0)
		{
			gl_FragColor = uSquareColor;
		}
		else{
			gl_FragColor = vec4(1.0,1.0,1.0,1.0);
		}
	}

	
	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}

