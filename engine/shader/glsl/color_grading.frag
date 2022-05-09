#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    highp float b = color.b * _COLORS;
    highp float y = color.g;

    highp float lx = floor(b) / _COLORS + color.r / _COLORS;
    highp vec4 color_lb = texture(color_grading_lut_texture_sampler, vec2(lx, y));

    highp float rx = ceil(b) / _COLORS + color.r / _COLORS;
    highp vec4 color_ub = texture(color_grading_lut_texture_sampler, vec2(rx, y));

    highp vec4 mixColor = mix(color_lb, color_ub, fract(b));
    out_color = mixColor;
}
