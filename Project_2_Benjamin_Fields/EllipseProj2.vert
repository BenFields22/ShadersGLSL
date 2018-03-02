#version 330 compatibility

out vec4  vColor;
out float vLightIntensity;
out vec2  vST;
out vec3 vMCposition;
out vec3 ECposition;

const vec3 LIGHTPOS = vec3( 0., 0., 10. );

void
main( )
{
	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vColor = gl_Color;
	vMCposition = gl_Vertex.xyz;

	vColor = gl_Color;
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}