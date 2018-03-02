#version 330 compatibility

//light position
uniform float uLightX, uLightY, uLightZ;


out vec4 vMC;

//pass on normals and lighting info
flat out vec3 Nf;
     out vec3 Ns;
flat out vec3 Lf;
     out vec3 Ls;
flat out vec3 Ef;
     out vec3 Es;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

//texture coordinates
out vec2 vST;

void
main( )
{
	vMC = gl_Vertex;
	Nf = normalize( gl_NormalMatrix * gl_Normal );	// surface normal vector
	Ns = Nf;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	Lf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	Ls = Lf;
	Ef = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	Es = Ef;
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}