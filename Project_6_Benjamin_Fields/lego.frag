#version 330 compatibility

in float gLightIntensity;
uniform vec4 uColor;

void
main( )
{
	gl_FragColor = vec4(  ( 0.03 + 0.8*gLightIntensity ) * uColor.rgb, 1.  );
}
