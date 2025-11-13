package com.example.studenttracker.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.security.Key;
@Component
public class JwtUtils {
  @Value("${jwt.secret}") private String jwtSecret;
  @Value("${jwt.expirationMs}") private int jwtExpirationMs;
  private Key getKey(){ return Keys.hmacShaKeyFor(jwtSecret.getBytes()); }
  public String generateToken(String username){
    Date now = new Date();
    Date exp = new Date(now.getTime() + jwtExpirationMs);
    return Jwts.builder().setSubject(username).setIssuedAt(now).setExpiration(exp).signWith(getKey()).compact();
  }
  public String getUsernameFromToken(String token){ return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().getSubject(); }
  public boolean validateToken(String token){
    try{ Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token); return true; }
    catch(Exception e){ return false; }
  }
}
