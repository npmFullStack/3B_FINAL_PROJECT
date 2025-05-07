<?php

// Path to the problematic file
$file = __DIR__ . '/vendor/nunomaduro/termwind/src/ValueObjects/Node.php';

// Read the file content
$content = file_get_contents($file);

// Replace the constructor with a nullable version
$content = str_replace(
    'public function __construct(private \DOMNode $node) {}',
    'public function __construct(private ?\DOMNode $node = null) {
        if ($node === null) {
            $dom = new \DOMDocument();
            $this->node = $dom->createElement("span");
        }
    }',
    $content
);

// Save the modified file
file_put_contents($file, $content);

echo "Termwind Node.php patched successfully!\n";
