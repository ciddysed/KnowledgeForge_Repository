package com.g1AppDev.KnowledgeForge.Controller;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.g1AppDev.KnowledgeForge.Entity.Module;
import com.g1AppDev.KnowledgeForge.Service.ModuleService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private final ModuleService moduleService;
    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    private static final Logger logger = LoggerFactory.getLogger(ModuleController.class);

    // Create Module
    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        Module createdModule = moduleService.createModule(module);
        return new ResponseEntity<>(createdModule, HttpStatus.CREATED);
    }

    // Get Module by ID
    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable int id) {
        Optional<Module> module = moduleService.findModuleById(id);
        return module.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get All Modules
    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        List<Module> modules = moduleService.findAllModules();
        return ResponseEntity.ok(modules);
    }

    // Get Modules by Topic ID
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Module>> getModulesByTopicId(@PathVariable int topicId) {
        List<Module> modules = moduleService.findModulesByTopicId(topicId);
        return ResponseEntity.ok(modules);
    }

    // Update Module
    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable int id, @RequestBody Module updatedModule) {
        Module module = moduleService.updateModule(id, updatedModule);
        if (module != null) {
            return ResponseEntity.ok(module);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete Module
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable int id) {
        boolean isDeleted = moduleService.deleteModule(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<Void> uploadFile(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        try {
            moduleService.uploadFile(id, file);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/uploads/{fileName:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads").toAbsolutePath().normalize().resolve(fileName).normalize();
            logger.info("Resolved file path: " + filePath.toString());
            if (!Files.exists(filePath)) {
                logger.error("File not found: " + filePath.toString());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                logger.error("File is not readable: " + filePath.toString());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception ex) {
            logger.error("Error accessing file: " + fileName, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
