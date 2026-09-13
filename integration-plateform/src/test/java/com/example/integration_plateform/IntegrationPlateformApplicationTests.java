package com.example.integration_plateform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.mongodb.uri=mongodb://localhost:27017/test",
    "spring.data.mongodb.uri=mongodb://localhost:27017/test"
})
class IntegrationPlateformApplicationTests {

	@Test
	void contextLoads() {
	}

}
