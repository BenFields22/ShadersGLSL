#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uSpeed;
uniform float Timer;
uniform bool uTime;

out vec4 vMC;
flat out vec3 Nf;
     out vec3 Ns;
flat out vec3 Lf;
     out vec3 Ls;
flat out vec3 Ef;
     out vec3 Es;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );
const float PI = 3.14159;

void
main( )
{ 
	vec4 pos = gl_Vertex;
	vMC = pos;
	vec4 ECposition = gl_ModelViewMatrix * pos;
	//float dzdx = uK * (Y0-pos.y) * (2.*PI/uP) * cos( 2.*PI*pos.x/uP );
	//float dzdy = -uK * sin( 2.*PI*pos.x/uP );
	//vec3 Tx = vec3(1., 0., dzdx );
	//vec3 Ty = vec3(0., 1., dzdy );
	
	//vec3 normal = cross(Tx,Ty);
	vec3 normal = vec3(0.0,1.0,0.0);

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