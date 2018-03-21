#version 330 compatibility

in vec4 vMC;

void
main( )
{
	vec4 color;
	vec4 color1 = vec4(1.0,0.96,0.62,1.0);
	vec4 color2 = vec4(0.48,0.77,0.46,1.0);
	vec4 color3 = vec4(0.1,0.48,0.19,1.0);
	vec4 color4 = vec4(0.45,0.39,0.34,1.0);
	vec4 color5 = vec4(1.0,1.0,1.0,1.0);
	float edge1 = -5.0;
	float edge2 = 5.0;
	float edge3 = 12.0;
	float edge4 = 20.0;
	float edge5 = 23.0;

	float y = vMC.y;
	if(y < edge1)
	{
		color = color1;
	}
	else if(y < edge2)
	{
		float t = smoothstep(edge1,edge2,y);
		color = mix(color1,color2,t);
	}
	else if(y < edge3)
	{
		float t = smoothstep(edge2,edge3,y);
		color = mix(color2,color3,t);
	}
	else if(y < edge4)
	{
		float t = smoothstep(edge3,edge4,y);
		color = mix(color3,color4,t);
	}
	else if(y < edge5)
	{
		float t = smoothstep(edge4,edge5,y);
		color = mix(color4,color5,t);
	}
	else
	{
		color = color5;
	}
	
	gl_FragColor = color;
}
