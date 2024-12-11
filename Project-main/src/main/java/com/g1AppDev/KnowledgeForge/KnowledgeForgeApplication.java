package com.g1AppDev.KnowledgeForge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@ComponentScan(
    basePackages = "com.g1AppDev.KnowledgeForge",
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.g1AppDev.KnowledgeForge.WebConfig.class)
)

@SpringBootApplication
public class KnowledgeForgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(KnowledgeForgeApplication.class, args);
	}

}
