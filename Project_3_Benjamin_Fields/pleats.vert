#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uK;
uniform float uP;
uniform float uSpeed;
uniform float Timer;
out vec4 vMC;
uniform bool uTime;

flat out vec3 Nf;
     out vec3 Ns;
flat out vec3 Lf;
     out vec3 Ls;
flat out vec3 Ef;
     out vec3 Es;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );
const float Y0 = 1.0;
const float PI = 3.14159;

void
main( )
{ 

	
	vec4 pos = gl_Vertex;
	if(uTime == true)
	{
		pos.z = uK * (Y0-pos.y) * sin( 2.*PI*pos.x-(.5 + .5*sin(2.*PI*uSpeed*Timer ))/uP );
	}
	else
	{
		pos.z = uK * (Y0-pos.y) * sin( 2.*PI*pos.x/uP );
	}
	
	vMC = pos;
	vec4 ECposition = gl_ModelViewMatrix * pos;
	float dzdx = uK * (Y0-pos.y) * (2.*PI/uP) * cos( 2.*PI*pos.x/uP );
	float dzdy = -uK * sin( 2.*PI*pos.x/uP );
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	
	vec3 normal = cross(Tx,Ty);

	Nf = normalize( gl_NormalMatrix * normal );	// surface normal vector
	Ns = Nf;

	Lf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	Ls = Lf;
	Ef = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	Es = Ef;

	gl_Position = gl_ModelViewProjectionMatrix * pos;
}