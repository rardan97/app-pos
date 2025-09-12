package com.blackcode.pos_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpHeaders;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImageLoadDto {
    private byte[] image;
    private HttpHeaders headers;
}
