#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform float uRadius;
uniform bool uCircle;
uniform bool uApply;


in vec2 vST;

float	 ResS, ResT;		// texture size
float frameWidth = .005;
void
main( )
{
	ivec2 ires = textureSize( uImageUnit, 0 );
	ResS = float( ires.s );
	ResT = float( ires.t );
	

	vec4 color;

	if(uApply)
	{
		if(uCircle)
	{
		vec2 vector = vST - vec2(uScenter,uTcenter);
		//check if the fragment is in the frame
		if(length(vector) < uRadius)
		{
			float s = vST.s - uScenter;
			float t = vST.t - uTcenter;
			s = s * 1.0 / uMagFactor;
			t = t * 1.0 / uMagFactor;
			float X = s*cos(uRotAngle) - t*sin(uRotAngle) + uScenter;
			float Y = s*sin(uRotAngle) + t*cos(uRotAngle) + uTcenter;
			vec2 newST = vec2(X,Y);
			vec3 rgb = texture2D( uImageUnit,  newST ).rgb;
			vec2 stp0 = vec2(1./ResS, 0. );
			vec2 st0p = vec2(0. , 1./ResT);
			vec2 stpp = vec2(1./ResS, 1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 = texture2D( uImageUnit, newST ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, newST-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, newST+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, newST-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, newST+stpm ).rgb;
			vec3 im10 = texture2D( uImageUnit, newST-stp0 ).rgb;
			vec3 ip10 = texture2D( uImageUnit, newST+stp0 ).rgb;
			vec3 i0m1 = texture2D( uImageUnit, newST-st0p ).rgb;
			vec3 i0p1 = texture2D( uImageUnit, newST+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			//color = vec4(rgb,1.0);
			color= vec4( mix( target, rgb, uSharpFactor ), 1. );
		}
		//add a frame to the lense
		else if(length(vector) > uRadius && length(vector)< uRadius +frameWidth)
		{
			color = vec4(0.0,0.0,0.0,1.0);
		}
		//render normally since fragment is not in the frame
		else
		{
			vec3 rgb = texture2D( uImageUnit,  vST ).rgb;
			color = vec4(rgb,1.0);
		}
	}
	else
	{
		//check if the fragment is in the frame
		if(vST.s < uScenter + uDs && vST.s > uScenter - uDs && vST.t < uTcenter + uDt && vST.t > uTcenter - uDt )
		{
			float s = vST.s - uScenter;
			float t = vST.t - uTcenter;
			s = s * 1.0 / uMagFactor;
			t = t * 1.0 / uMagFactor;
			float X = s*cos(uRotAngle) - t*sin(uRotAngle) + uScenter;
			float Y = s*sin(uRotAngle) + t*cos(uRotAngle) + uTcenter;
			vec2 newST = vec2(X,Y);
			vec3 rgb = texture2D( uImageUnit,  newST ).rgb;
			vec2 stp0 = vec2(1./ResS, 0. );
			vec2 st0p = vec2(0. , 1./ResT);
			vec2 stpp = vec2(1./ResS, 1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 = texture2D( uImageUnit, newST ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, newST-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, newST+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, newST-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, newST+stpm ).rgb;
			vec3 im10 = texture2D( uImageUnit, newST-stp0 ).rgb;
			vec3 ip10 = texture2D( uImageUnit, newST+stp0 ).rgb;
			vec3 i0m1 = texture2D( uImageUnit, newST-st0p ).rgb;
			vec3 i0p1 = texture2D( uImageUnit, newST+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			//color = vec4(rgb,1.0);
			color= vec4( mix( target, rgb, uSharpFactor ), 1. );
		}
		//add a frame to the lense
		else if(vST.s > uScenter + uDs && vST.s < uScenter + uDs + frameWidth && vST.t < uTcenter + uDt && vST.t > uTcenter - uDt ||
		vST.s < uScenter - uDs && vST.s > uScenter - uDs - frameWidth && vST.t < uTcenter + uDt && vST.t > uTcenter - uDt || 
		vST.t > uTcenter + uDt && vST.t < uTcenter + uDt + frameWidth && vST.s < uScenter + uDs + frameWidth && vST.s > uScenter - uDs -frameWidth || 
		vST.t < uTcenter - uDt && vST.t > uTcenter - uDt - frameWidth && vST.s < uScenter + uDs + frameWidth && vST.s > uScenter - uDs -frameWidth
		)
		{
			color = vec4(0.0,0.0,0.0,1.0);
		}
		//render normally since fragment is not in the frame
		else
		{
			vec3 rgb = texture2D( uImageUnit,  vST ).rgb;
			color = vec4(rgb,1.0);
		}

	}
	}
	else
	{
	  	vec3 rgb = texture2D( uImageUnit,  vST ).rgb;
		color = vec4(rgb,1.0);
	}
	gl_FragColor = color;
}

