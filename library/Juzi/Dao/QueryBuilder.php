<?php

class QueryBuilder {
    
    protected $fields = array();
    
    protected $table;
    
    protected $condition = array();
    
    protected $order = array();
    
    protected $group = array();
    
    protected $having;
    
    protected $range;
    
    protected $connection;

    public function __construct ($table, PDO $connection) {
        $this->table = $table;
        $this->connection = $connection;
    }

    public function execute () {
        $stmt = $this->connection->prepare((string) $this);
        $args = $this->getArguments();
        $stmt->execute($args);
        return $stmt;
    }

    private function getArguments () {
        $arguments = array();
        foreach ($this->condition as $condition) {
        	if (strtoupper($condition['operator']) == 'IN') {
        		continue;
        	}
            $arguments[] = $condition['value'];
        }
        return $arguments;
    }

    public function fields (array $fields = array()) {
        if ($fields) {
            $this->fields = $fields;
        } else {
            $this->fields = array(
                '*'
            );
        }
        return $this;
    }

    public function condition ($field, $value = NULL, $operator = NULL) {
        if (! isset($operator)) {
        	$operator = '=';
        }
        $condition = array(
            'field' => $field , 
            'value' => $value , 
            'operator' => $operator
        );
        $this->condition[] = $condition;
        return $this;
    }

    public function orderBy ($field, $direction = 'ASC') {
        $this->order[$field] = $direction;
        return $this;
    }

    public function range ($start = NULL, $length = NULL) {
        $this->range = func_num_args() ? array(
            'start' => $start , 
            'length' => $length
        ) : array();
        return $this;
    }

    public function groupBy ($field) {
        $this->group[] = $field;
        return $this;
    }

    public function __toString () {
        if (empty($this->fields)) {
            $this->fields = array(
                '*'
            );
        }
        $fields = implode(',', $this->fields);
        $sql = "SELECT {$fields} FROM {$this->table} ";
        
        if (! empty($this->condition)) {
            $sql .= ' WHERE ';
            foreach ($this->condition as $index => $condition) {
                if ($index > 0) {
                    $sql .= ' AND ';
                }
                
                if (strtoupper($condition['operator']) == 'IN') {
                	$sql .= "({$condition['field']} {$condition['operator']} ({$condition['value']}))";
                } else {
                	$sql .= "({$condition['field']} {$condition['operator']} ?)";
                }
                
            }
        }
        
        if (! empty($this->group)) {
            $sql .= ' GROUP BY ' . implode(',', $this->group);
        }
        
        if (! empty($this->order)) {
            $sql .= ' ORDER BY ';
            $orders = array();
            foreach ($this->order as $field => $direction) {
                $orders[] = "{$field} {$direction}";
            }
            $sql .= implode(',', $orders);
        }
        
        if (! empty($this->range['length']) && $this->range['length'] > 0) {
            $offset = (empty($this->range['start']) || $this->range['start'] < 0) ? 0 : $this->range['start'];
            $sql .= ' LIMIT ' . $offset . ', ' . $this->range['length'];
        }
        return $sql;
    }
}