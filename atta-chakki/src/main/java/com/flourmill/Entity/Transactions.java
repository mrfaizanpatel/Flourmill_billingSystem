package com.flourmill.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tansaction_id;

    @ManyToOne
    @JoinColumn(name = "custId")
    private Customer customer;

    private LocalDateTime in_time;    // ✅ Already correct
    @Column(name = "out_time", columnDefinition = "timestamp(6) without time zone")
    private LocalDateTime out_time;   // ✅ Changed from String to LocalDateTime

    private String flour_type;
    private String quantity;
    private String unit_price;
    private long total;

    public Transactions() {}

    // ✅ Getter and setter for tansaction_id
    public int getTansaction_id() {
        return tansaction_id;
    }

    public void setTansaction_id(int tansaction_id) {
        this.tansaction_id = tansaction_id;
    }

    // ✅ Getter and setter for customer
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    // ✅ Getter and setter for in_time
    public LocalDateTime getIn_time() {
        return in_time;
    }

    public void setIn_time(LocalDateTime in_time) {
        this.in_time = in_time;
    }

    // ✅ REPLACED THIS (incorrect):
    // public String LocalDateTime() {
    //     return out_time;
    // }
    // public void LocalDateTime(String out_time) {
    //     this.out_time = out_time;
    // }

    // ✅ WITH THIS (correct getter & setter):
    public LocalDateTime getOut_time() {
        return out_time;
    }

    public void setOut_time(LocalDateTime out_time) {
        this.out_time = out_time;
    }

    // ✅ Getter and setter for flour_type
    public String getFlour_type() {
        return flour_type;
    }

    public void setFlour_type(String flour_type) {
        this.flour_type = flour_type;
    }

    // ✅ Getter and setter for quantity
    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    // ✅ Getter and setter for unit_price
    public String getUnit_price() {
        return unit_price;
    }

    public void setUnit_price(String unit_price) {
        this.unit_price = unit_price;
    }

    // ✅ Getter and setter for total
    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}
