#version 330 compatibility

flat in vec3 Nf;
     in vec3 Ns;
flat in vec3 Lf;
     in vec3 Ls;
flat in vec3 Ef;
     in vec3 Es;

in vec4 vMC;

uniform float uKa, uKd, uKs;
uniform sampler3D Noise3;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float Timer;
uniform vec4 uSpecularColor;
uniform float uShininess;
uniform bool uFlat;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	vec4 color = vec4(0.0,0.2,0.8,0.8);
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
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC.xyz+Timer );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5)+Timer );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	Normal = RotateNormal(angx,angy,Normal);

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

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 0.8 );

}