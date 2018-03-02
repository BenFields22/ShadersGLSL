#version 330 compatibility

//read in from 3D noise texture
uniform sampler3D Noise3;

//uniform parameters to define characteristics of wood
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uNoiseFreqWood;
uniform float uScale;//controls density of grain
uniform float uDegreesZ;
uniform float uDegreesX;
uniform vec4 uDarkWood;//color of dark grain
uniform vec4 uLightWood;//color of light grain

//uniform parameters used in lighting model
uniform bool uFlat;
uniform float uKa, uKd, uKs;
uniform float uK;
uniform float uP;
uniform vec4 uSpecularColor;
uniform float uShininess;

//light and normal information from vertex shader
flat in vec3 Nf;
     in vec3 Ns;
flat in vec3 Lf;
     in vec3 Ls;
flat in vec3 Ef;
     in vec3 Es;

//texture coordinates and model coordinates from vertex shader
in vec2 vST;
in vec4 vMC;


//define transformation matrices to get a slice of the virtual wood log within the scene
mat4 slice = mat4(vec4(uScale,0.0,0.0,0.0),vec4(0.0,uScale,0.0,0.0),vec4(0.0,0.0,uScale,0.0),vec4(0.0,0.0,0.0,1.0));

mat4 rotX = mat4(vec4(1.0,0.0,0.0,0.0),vec4(0.0,cos(uDegreesX),-sin(uDegreesX),0.0),vec4(0.0,sin(uDegreesX),cos(uDegreesX),0.0),vec4(0.0,0.0,0.0,1.0));

mat4 rotZ = mat4(vec4(cos(uDegreesZ),-sin(uDegreesZ),0.0,0.0),vec4(sin(uDegreesZ),cos(uDegreesZ),0.0,0.0),vec4(0.0,0.0,0.0,0.0),vec4(0.0,0.0,0.0,1.0));


void
main( )
{

	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	if( uFlat )
	{
		Normal = normalize(Nf);
		Light = normalize(Lf);
		Eye = normalize(Ef);
	}
	else
	{
		Normal = normalize(Ns);
		Light = normalize(Ls);
		Eye = normalize(Es);
	}


	//define the section of the virtual log to be used
	vec4 cyl = rotX*rotZ*slice*vec4(vST.st,0.0,1.0);
	float dist = length(cyl.xz);//distance to the center of the log or in this case the y axis
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC.xyz );//noise value to shift the distance
	float distanceFromCenterNoise = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	distanceFromCenterNoise *= uNoiseAmp;
	dist += distanceFromCenterNoise;//change the distance to center


	//define the noise to slightly shift the color tone in the woods
	vec4 shiftNoise = texture( Noise3, uNoiseFreqWood*vMC.xyz );
	float shiftColorLight = (shiftNoise.g - 0.5);
	float shiftColorDark = (shiftNoise.b - 0.5);
	

	//color the position based on location in log. 
	//The dark grain is present in thin stripes around integer values.
	float t = 1.0 - abs( fract(dist) * 2.0 - 1.0);
	t = smoothstep(0.2,0.5,t);
	vec4 color = mix(uDarkWood + shiftColorDark, uLightWood+ shiftColorLight,t);
	

	//use standard ADS lighting model
	vec4 ambient = uKa * color;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * color;

	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 specular = uKs * s * uSpecularColor;

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
}

