package com.ssafy.api.controller;


import com.ssafy.api.request.UserProfileDto;
import com.ssafy.api.request.UserUpdateDto;
import com.ssafy.api.service.FollowService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.FWUserDetails;
import com.ssafy.db.dto.Message;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.FollowRepository;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepository2;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.nio.charset.Charset;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    FollowService followService;
    @Autowired
    UserService userService;
    @Autowired
    FollowRepository followRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserRepository2 userRepository2;
    @ApiOperation(value = "사용자의 상세 정보를 반환한다.", response = User.class)
    @GetMapping("/{user_id}")
    public ResponseEntity<?> findUser(@PathVariable String user_id, @ApiIgnore Authentication authentication){

        FWUserDetails userDetails = (FWUserDetails) authentication.getDetails();

        User user = userService.getUserByUserId(user_id);
        int articleCount = user.getArticles().size();
        int followingCount = followRepository.countByFrom(user);
        int followerCount = followRepository.countByTo(user);
        boolean isFollowed = followService.isFollow(user, userDetails.getUser());
        UserProfileDto userProfileDto = new UserProfileDto(user.getUserId(), user.getName(), articleCount, followerCount, followingCount, isFollowed);
        return ResponseEntity.status(200).body(userProfileDto);
    }
    @ApiOperation(value = "회원 정보 수정")
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody UserUpdateDto updateUserDto, @ApiIgnore Authentication authentication) throws Exception {
        FWUserDetails userDetails = (FWUserDetails) authentication.getDetails();
        userService.updateUser(userDetails.getUserIdx(), updateUserDto);
        return ResponseEntity.status(200).body("회원정보 수정 완료");
    }
    @ApiOperation(value = "회원 탈퇴")
    @DeleteMapping("/remove")
    public ResponseEntity<String> userdelete(@ApiIgnore Authentication authentication) throws Exception {
        FWUserDetails userDetails = (FWUserDetails) authentication.getDetails();
        User user = userDetails.getUser();
        userRepository2.delete(user);
        return ResponseEntity.status(200).body("회원 탈퇴 성공");
    }




}