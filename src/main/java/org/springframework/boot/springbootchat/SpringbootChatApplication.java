package org.springframework.boot.springbootchat;
/**
 * @author Geonsang
 *
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan
@EnableAutoConfiguration
public class SpringbootChatApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(SpringbootChatApplication.class, args);
    }
     
}