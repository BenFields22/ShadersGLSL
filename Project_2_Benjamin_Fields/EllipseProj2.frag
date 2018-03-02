#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;
in vec3 vMCposition;
in vec3 ECposition;

uniform bool  uSmooth;
uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform vec4  uSquareColor;
uniform sampler3D Noise3;
uniform float uAlpha;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform bool uUseChromaDepth;
uniform float uChromaRed;
uniform float uChromaBlue;

vec3
Rainbow( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}


void
main( )
{

	vec4  nv  = texture3D( Noise3, uNoiseFreq * vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = n - 2.;				// -1. -> 1.
	float delta = uNoiseAmp * n;

	float s = vST.s;
	float t = vST.t;
	int numins = int( s / uAd );
	int numint = int( t / uBd );
	float Ar = uAd/2.;
	float Br = uBd/2.;

	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center                    
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist+delta;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.
	ds *= scale;                            // scale by noise factor
	ds /= Ar;                               // ellipse equation

	dt *= scale;                            // scale by noise factor
	dt /= Br;                               // ellipse equation

	float d = ds*ds + dt*dt;


	if(uSmooth)
	{
		if(d <= 1.0+uTol && d >= 1.0 -uTol)
		{
			float dist = 2.0*uTol;
			float aNum = 1.0 - uTol;
			float newV = abs(d - aNum);
			float t = newV/dist;	
			gl_FragColor = mix( uSquareColor, vColor,t );
		}
		else if(d < 1.0 - uTol)
		{
			gl_FragColor = uSquareColor;
		}
		else if(d > 1.0 + uTol)
		{
			gl_FragColor = vec4(1.0,1.0,1.0,1.0);
			if(uAlpha < .00001)
			{
				discard;
			}
			else
			{
				gl_FragColor.a = uAlpha;
			}
		}

		
	}
	else
	{
		if(d <= 1.0)
		{
			gl_FragColor = uSquareColor;
		}
		else
		{
			gl_FragColor = vColor;
			if(uAlpha < .00001)
			{
				discard;
			}
			else
			{
				gl_FragColor.a = uAlpha;
			}
		}
	}

	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( ECposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		gl_FragColor.rgb = Rainbow( t );
	}
	
	
	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
	
	
}

