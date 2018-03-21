#version 330 compatibility

out vec4 vMC;

void
main( )
{
	vec4 newPosWithHeight = gl_Vertex;
	newPosWithHeight.y = 0.3*(gl_Vertex.z*sin(0.1*gl_Vertex.x)+ gl_Vertex.x*cos(0.1*gl_Vertex.z));
	vMC = newPosWithHeight;
	gl_Position = gl_ModelViewProjectionMatrix*newPosWithHeight;
}